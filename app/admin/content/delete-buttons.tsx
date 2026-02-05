"use client";

import dynamic from "next/dynamic";

export const DeleteBattleCardButton = dynamic(() => import("@/components/delete-battle-card-button").then(mod => mod.DeleteBattleCardButton), { ssr: false });
export const DeleteAnnouncementButton = dynamic(() => import("@/components/delete-announcement-button").then(mod => mod.DeleteAnnouncementButton), { ssr: false });
export const DeleteResourceButton = dynamic(() => import("@/components/delete-resource-button").then(mod => mod.DeleteResourceButton), { ssr: false });
