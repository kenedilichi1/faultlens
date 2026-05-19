"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { api } from "@/lib/api";
import { getLevelColor } from "@/utils/helper_function";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [logVolume, setLogVolume] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  const [selectedLevel, setSelectedLevel] = useState("ALL");

  const [selectedService, setSelectedService] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [incidentLogs, setIncidentLogs] = useState<any[]>([]);

  async function refreshMetrics() {
    const response = await api.get("/metrics/log-volume?interval=minute");

    setLogVolume(response.data);
  }

  useEffect(() => {
    async function loadIncidentLogs() {
      if (!selectedIncident) return;

      const response = await api.get(`/incidents/${selectedIncident.id}/logs`);

      setIncidentLogs(response.data);
    }

    loadIncidentLogs();
  }, [selectedIncident]);

  useEffect(() => {
    async function load() {
      const response = await api.get("/dashboard/summary");

      setSummary(response.data);
    }

    load();
  }, []);

  useEffect(() => {
    async function loadServices() {
      const response = await api.get("/metrics/services");

      setServices(response.data);
    }

    loadServices();
  }, []);

  useEffect(() => {
    async function loadLogs() {
      const response = await api.get("/logs/recent");

      setLogs(response.data);
    }

    loadLogs();
  }, []);

  useEffect(() => {
    async function loadMetrics() {
      const response = await api.get("/metrics/log-volume?interval=minute");

      setLogVolume(response.data);
    }

    loadMetrics();
  }, []);

  useEffect(() => {
    socket.on("dashboard.updated", async (data) => {
      setSummary(data);
      refreshMetrics();
      const servicesResponse = await api.get("/metrics/services");

      setServices(servicesResponse.data);
    });

    return () => {
      socket.off("dashboard.updated");
    };
  }, []);

  useEffect(() => {
    socket.on("log.created", (log) => {
      setLogs((prev) => [log, ...prev.slice(0, 19)]);
    });

    return () => {
      socket.off("log.created");
    };
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      search.length === 0
        ? true
        : log.message.toLowerCase().includes(search.toLowerCase()) ||
          log.serviceName.toLowerCase().includes(search.toLowerCase());
    const matchesLevel =
      selectedLevel === "ALL" ? true : log.level === selectedLevel;

    const matchesService =
      selectedService === "ALL" ? true : log.serviceName === selectedService;

    return matchesLevel && matchesService && matchesSearch;
  });
  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">FaultLens</h1>

        <p className="text-zinc-400">Realtime Observability Dashboard</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
            <p className="text-zinc-400 text-sm">Total Logs</p>

            <h2 className="text-3xl font-bold mt-2">
              {summary?.totalLogs ?? 0}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
            <p className="text-zinc-400 text-sm">Error Logs</p>

            <h2 className="text-3xl font-bold mt-2 text-red-500">
              {summary?.errorLogs ?? 0}
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
            <p className="text-zinc-400 text-sm">Health Score</p>

            <h2 className="text-3xl font-bold mt-2 text-green-500">
              {summary?.healthScore ?? 100}%
            </h2>
          </div>

          <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
            <p className="text-zinc-400 text-sm">Active Incidents</p>

            <h2 className="text-3xl font-bold mt-2 text-yellow-500">
              {summary?.recentIncidents?.length ?? 0}
            </h2>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Log Volume</h2>

            <span className="text-sm text-zinc-500">Last Activity</span>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={logVolume}>
                <XAxis
                  dataKey="bucket"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleTimeString()
                  }
                />

                <YAxis />

                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                />

                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 w-[300px]"
          />

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2"
          >
            <option value="ALL">All Levels</option>

            <option value="ERROR">ERROR</option>

            <option value="WARN">WARN</option>

            <option value="INFO">INFO</option>
          </select>

          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2"
          >
            <option value="ALL">All Services</option>

            {services.map((service) => (
              <option key={service.serviceName} value={service.serviceName}>
                {service.serviceName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LIVE ACTIVITY */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
              <h2 className="text-xl font-semibold mb-4">Live Activity</h2>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredLogs.length === 0 ? (
                  <div className="text-zinc-500 text-center py-8">
                    No logs match current filters.
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="border border-zinc-800 rounded-xl p-4"
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className={`font-bold ${getLevelColor(log.level)}`}
                        >
                          {log.level}
                        </span>

                        <span className="text-zinc-500 text-sm">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      <p className="mt-2">{log.message}</p>

                      <p className="text-sm text-zinc-400 mt-2">
                        {log.serviceName}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* INCIDENT PANEL */}
          <div>
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
              <h2 className="text-xl font-semibold mb-4">Recent Incidents</h2>

              <div className="space-y-3">
                {summary?.recentIncidents?.map((incident: any) => (
                  <div
                    key={incident.id}
                    onClick={() => setSelectedIncident(incident)}
                    className="cursor-pointer hover:border-red-500 transition-colors border border-zinc-800 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{incident.severity}</span>

                      <span className="text-sm text-zinc-500">
                        {incident.occurrenceCount}x
                      </span>
                    </div>

                    <p className="mt-2 text-sm">{incident.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 mt-6">
              <h2 className="text-xl font-semibold mb-4">Service Health</h2>

              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.serviceName}
                    className="flex items-center justify-between border border-zinc-800 rounded-xl p-3"
                  >
                    <div>
                      <p className="font-medium">{service.serviceName}</p>

                      <p className="text-sm text-zinc-500">Error Volume</p>
                    </div>

                    <div className="text-red-500 font-bold text-lg">
                      {service._count.id}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedIncident && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-[700px] max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Incident Details</h2>

              <button
                onClick={() => setSelectedIncident(null)}
                className="text-zinc-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-zinc-500 text-sm">Severity</p>

                <p className="font-bold">{selectedIncident.severity}</p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm">Title</p>

                <p>{selectedIncident.title}</p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm">Occurrences</p>

                <p>{selectedIncident.occurrenceCount}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Related Logs</h3>

              <div className="space-y-3">
                {incidentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border border-zinc-800 rounded-xl p-3"
                  >
                    <p>{log.message}</p>

                    <p className="text-sm text-zinc-500 mt-1">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
