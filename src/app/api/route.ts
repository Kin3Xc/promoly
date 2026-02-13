import { NextResponse } from "next/server";
import { testRedisConnection } from "@/lib/redis";
import { testDatabaseConnection } from "@/lib/db";

export async function GET() {
  const [dbOk, redisOk] = await Promise.all([
    testDatabaseConnection(),
    testRedisConnection(),
  ]);

  return NextResponse.json({
    status: dbOk && redisOk ? "healthy" : "degraded",
    services: {
      database: dbOk ? "connected" : "disconnected",
      redis: redisOk ? "connected" : "disconnected",
    },
  });
}
