import type { Metadata } from "next";
import { DemoApp } from "@/components/demo/demo-app";

export const metadata: Metadata = {
  title: "HarborSync Demo",
  description: "Safe HarborSync sandbox demo with fake data.",
  robots: {
    index: false,
    follow: false
  }
};

export default function DemoPage() {
  return <DemoApp />;
}
