import type { NextPage } from "next";

export type Page<P = {}, IP = P> = NextPage<P, IP> & {
    Title: string
};