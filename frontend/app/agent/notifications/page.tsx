"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Bell, AlertCircle, CheckCircle2, DollarSign, CreditCard } from "lucide-react";

interface Notification {
  id: string;
  type: "installment" | "commission" | "followup" | "alert";
  title: string;
  message: string;
  time: string;
  read: boolean;
  action?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "N-001",
    type: "installment",
    title: "Pending Installment",
    message: "Hassan Raza has an installment due on Jan 20 for PL-202",
    time: "2 hours ago",
    read: false,
    action: "View Installment",
  },
  {
    id: "N-002",
    type: "commission",
    title: "Commission Approved",
    message: "PKR 450K commission approved for Emerald Enclave sale",
    time: "1 day ago",
    read: false,
    action: "View Commission",
  },
  {
    id: "N-003",
    type: "followup",
    title: "Follow-up Reminder",
    message: "Follow up with Ayesha Khan regarding Sector B plot",
    time: "2 days ago",
    read: true,
  },
  {
    id: "N-004",
    type: "alert",
    title: "Plot Status Changed",
    message: "PL-205 status changed from 'Available' to 'Hold'",
    time: "3 days ago",
    read: true,
  },
];

const iconMap = {
  installment: CreditCard,
  commission: DollarSign,
  followup: Bell,
  alert: AlertCircle,
};

const colorMap = {
  installment: "bg-blue-100 text-blue-800",
  commission: "bg-green-100 text-green-800",
  followup: "bg-yellow-100 text-yellow-800",
  alert: "bg-red-100 text-red-800",
};

export default function NotificationsPage() {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <AnimatedSection variant="slideUp">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111]">Notifications</h1>
            <p className="text-[#3A3C40] mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
          <button className="px-4 py-2 bg-white border border-[#E7EAEF] rounded-xl text-sm font-medium text-[#3A3C40] hover:bg-[#FAFAFA] transition-colors">
            Mark all as read
          </button>
        </div>
      </AnimatedSection>

      {/* Notifications List */}
      <AnimatedSection variant="slideUp">
        <Card className="bg-white border-[#E7EAEF]">
          <CardContent className="p-0 divide-y divide-[#E7EAEF]">
            {mockNotifications.map((notification) => {
              const Icon = iconMap[notification.type];
              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-[#FAFAFA] transition-colors ${
                    !notification.read ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-xl ${colorMap[notification.type]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-[#111111]">{notification.title}</p>
                          <p className="text-sm text-[#3A3C40] mt-1">{notification.message}</p>
                          <p className="text-xs text-[#3A3C40]/60 mt-2">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-[#6139DB] flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      {notification.action && (
                        <button className="mt-3 text-sm text-[#6139DB] font-medium hover:underline">
                          {notification.action} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}

