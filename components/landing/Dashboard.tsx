"use client"

import type React from "react"
import Image from "next/image"
import { ShineBorder } from "@/components/magicui/shine-border"

const Dashboard: React.FC = () => (
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
    <div className="relative p-2 rounded-2xl sm:p-3 sm:rounded-3xl bg-gradient-to-br from-zinc-600/40 via-zinc-700/30 to-zinc-600/40 backdrop-blur-2xl border border-zinc-700/50 shadow-2xl shadow-zinc-900/50">
      <ShineBorder
        shineColor={["#A07CFE"]}
        borderWidth={0.5}
      />

      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-zinc-600/5 via-transparent to-zinc-500/5 blur-2xl"></div>

      <div className="relative rounded-2xl overflow-hidden bg-zinc-950/60 backdrop-blur-sm border border-zinc-700/30 shadow-inner">
        <div className="flex items-center justify-between gap-2 px-4 py-3 bg-gradient-to-r from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 backdrop-blur-md border-b border-zinc-700/40">
          <div className="flex gap-2 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/90 shadow-sm" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/90 shadow-sm" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/90 shadow-sm" />
          </div>
          <div className="flex-1 mx-4 min-w-0 text-center">
            <div className="bg-zinc-800/60 rounded-lg px-3 py-1.5 text-xs text-zinc-300 font-mono border border-zinc-700/30 shadow-inner inline-block">
              <span className="text-zinc-500">https://</span>
              <span className="text-zinc-200">hookflo.com</span>
              <span className="text-zinc-400">/dashboard</span>
            </div>
          </div>
          <div className=" gap-2 shrink-0 hidden sm:flex">
            <div className="w-5 h-5 rounded-md bg-zinc-700/50 border border-zinc-600/30" />
            <div className="w-5 h-5 rounded-md bg-zinc-700/50 border border-zinc-600/30" />
          </div>
        </div>

        <div className="relative">
          <Image
            src="/webhook-dashboard.png"
            alt="Webhook Dashboard Interface"
            width={1200}
            height={800}
            className="w-full h-auto"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/10 via-transparent to-zinc-900/5 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-zinc-800/5 pointer-events-none" />
        </div>
      </div>

      <div className="absolute -inset-4 bg-gradient-to-br from-zinc-600/10 via-transparent to-zinc-500/10 blur-3xl -z-10 rounded-3xl" />
      <div className="absolute -inset-8 bg-gradient-to-br from-zinc-700/5 via-transparent to-zinc-600/5 blur-3xl -z-20 rounded-3xl" />
    </div>
  </div>
)

export default Dashboard
