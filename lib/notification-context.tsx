"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useApolloClient, useQuery, useMutation } from "@apollo/client/react"
import type { Reference } from "@apollo/client"
import { useAuth } from "@/lib/auth-context"
import {
  GET_NOTIFICATIONS,
  MARK_READ,
  MARK_ALL_READ,
  DELETE_NOTIFICATION,
} from "@/features/notifications/graphql/notifications.queries"

export interface AppNotification {
  id: string
  type: string
  title: string
  message: string
  data?: string
  read: boolean
  createdAt: string
}

interface NotificationContextValue {
  notifications: AppNotification[]
  unreadCount: number
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
  removeNotification: (id: string) => Promise<void>
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql"
const SSE_URL = GRAPHQL_URL.replace("/graphql", "/api/notifications/stream")

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const client = useApolloClient()
  const esRef = useRef<EventSource | null>(null)

  // SSE pushes keyed by userId — prevents stale entries from a previous login session
  const [sseByUser, setSseByUser] = useState<Record<string, AppNotification[]>>({})

  // DB notifications — refetch whenever the logged-in user changes
  const { data, refetch } = useQuery<{ getNotifications: AppNotification[] }>(
    GET_NOTIFICATIONS,
    {
      variables: { limit: 30 },
      skip: !user,
      fetchPolicy: "network-only",
    }
  )

  // Re-fetch from DB when the user id changes (different login session)
  const prevUserIdRef = useRef<string | null>(null)
  useEffect(() => {
    const uid = user?.id ?? null
    if (uid && uid !== prevUserIdRef.current) {
      prevUserIdRef.current = uid
      refetch()
    }
    if (!uid) prevUserIdRef.current = null
  }, [user?.id, refetch])

  const [markReadMutation] = useMutation(MARK_READ)
  const [markAllReadMutation] = useMutation(MARK_ALL_READ)
  const [deleteNotificationMutation] = useMutation(DELETE_NOTIFICATION)

  // SSE — open when logged in; setState only inside the event callback (satisfies lint rule)
  useEffect(() => {
    if (!user) {
      esRef.current?.close()
      esRef.current = null
      return
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) return

    const userId = user.id

    const connect = () => {
      const es = new EventSource(`${SSE_URL}?token=${encodeURIComponent(token)}`)
      esRef.current = es

      es.addEventListener("notification", (e: MessageEvent) => {
        try {
          const notif: AppNotification = JSON.parse(e.data)
          setSseByUser((prev) => ({
            ...prev,
            [userId]: [notif, ...(prev[userId] ?? [])],
          }))
        } catch { /* ignore parse errors */ }
      })

      es.onerror = () => {
        es.close()
        setTimeout(connect, 5_000)
      }
    }

    connect()

    return () => {
      esRef.current?.close()
      esRef.current = null
    }
  }, [user])

  // Merge SSE pushes (live) with DB list (historical), deduplicated by id
  const notifications = useMemo<AppNotification[]>(() => {
    const userId = user?.id
    const ssePushes = userId ? (sseByUser[userId] ?? []) : []
    const dbList = data?.getNotifications ?? []
    const sseIds = new Set(ssePushes.map((n) => n.id))
    return [...ssePushes, ...dbList.filter((n) => !sseIds.has(n.id))]
  }, [user?.id, sseByUser, data])

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  )

  const markRead = useCallback(async (id: string) => {
    await markReadMutation({ variables: { id } })
    setSseByUser((prev) => {
      const userId = user?.id
      if (!userId) return prev
      return {
        ...prev,
        [userId]: (prev[userId] ?? []).map((n) => (n.id === id ? { ...n, read: true } : n)),
      }
    })
    client.cache.evict({ fieldName: "getNotifications" })
  }, [markReadMutation, user?.id, client])

  const markAllRead = useCallback(async () => {
    await markAllReadMutation()
    setSseByUser((prev) => {
      const userId = user?.id
      if (!userId) return prev
      return {
        ...prev,
        [userId]: (prev[userId] ?? []).map((n) => ({ ...n, read: true })),
      }
    })
    client.cache.modify({
      fields: { getUnreadNotificationCount: () => 0 },
    })
    refetch()
  }, [markAllReadMutation, user?.id, client, refetch])

  const removeNotification = useCallback(async (id: string) => {
    // Optimistic: remove from local state immediately so the UI updates instantly
    setSseByUser((prev) => {
      const userId = user?.id
      if (!userId) return prev
      return {
        ...prev,
        [userId]: (prev[userId] ?? []).filter((n) => n.id !== id),
      }
    })
    client.cache.modify({
      fields: {
        getNotifications: (existing: readonly Reference[], { readField }) =>
          existing.filter((ref) => readField("id", ref) !== id),
      },
    })
    // Fire-and-forget — UI already updated
    deleteNotificationMutation({ variables: { id } }).catch(console.error)
  }, [deleteNotificationMutation, user?.id, client])

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, markAllRead, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider")
  return ctx
}
