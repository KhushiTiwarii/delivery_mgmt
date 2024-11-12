// app/assignments/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AssignmentMetrics {
  totalAssigned: number;
  successRate: number;
  averageTime: number;
  failureReasons: {
    reason: string;
    count: number;
  }[];
}

export default function Assignments() {
  const [metrics, setMetrics] = useState<AssignmentMetrics | null>(null)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    const response = await fetch('/api/assignments/metrics')
    const data = await response.json()
    setMetrics(data)
  }

  const handleRunAssignments = async () => {
    await fetch('/api/assignments/run', { method: 'POST' })
    fetchMetrics()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Assignment System</h1>
      <Button onClick={handleRunAssignments} className="mb-4">Run Assignments</Button>
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Assigned</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{metrics.totalAssigned}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{metrics.successRate.toFixed(2)}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{metrics.averageTime} ms</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Failure Reasons</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {metrics.failureReasons.map((reason, index) => (
                  <li key={index}>{reason.reason}: {reason.count}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}