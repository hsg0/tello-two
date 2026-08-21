"use client";

import { useEffect, useState } from "react";
import { createUser, startupDrone } from "@/lib/api";

const USER_ID_KEY = "tello_user_id";
const DRONE_OPTIONS = ["tello-1", "tello-2", "tello-3"];

const TELEMETRY = [
  { label: "Battery", value: "87%" },
  { label: "Height", value: "12 m" },
  { label: "Speed", value: "1.4 m/s" },
  { label: "Yaw", value: "180°" },
  { label: "Pitch", value: "0°" },
  { label: "Roll", value: "2°" },
  { label: "Temperature", value: "34°C" },
  { label: "Flight Time", value: "00:04:32" },
];

export default function DashboardPage() {
  const [cameraMode, setCameraMode] = useState("Video");
  const [userId, setUserId] = useState("");
  const [droneId, setDroneId] = useState(DRONE_OPTIONS[0]);
  const [assignment, setAssignment] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("OFFLINE");
  const [loadingUser, setLoadingUser] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const ensureUser = async () => {
      try {
        const stored = localStorage.getItem(USER_ID_KEY);
        if (stored) {
          if (!cancelled) {
            setUserId(stored);
            setLoadingUser(false);
          }
          return;
        }

        const data = await createUser();
        if (cancelled) return;

        localStorage.setItem(USER_ID_KEY, data.userId);
        setUserId(data.userId);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || "Failed to assign user id");
          setConnectionStatus("ERROR");
        }
      } finally {
        if (!cancelled) setLoadingUser(false);
      }
    };

    ensureUser();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleConnect = async () => {
    if (!droneId) {
      setError("Select a drone first");
      return;
    }

    setConnecting(true);
    setError("");
    setConnectionStatus("CONNECTING");

    try {
      const data = await startupDrone({
        userId: userId || undefined,
        droneId,
      });

      if (data.userId) {
        localStorage.setItem(USER_ID_KEY, data.userId);
        setUserId(data.userId);
      }

      setAssignment(data.drone);
      setConnectionStatus("ONLINE");
    } catch (err) {
      setAssignment(null);
      setConnectionStatus("ERROR");
      setError(err.response?.data?.message || "Failed to assign drone");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#05070A] p-4 text-white">
      <header className="mb-4 flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold">TELLO COMMAND CENTER</h1>
          <p className="text-sm text-gray-400">Web Drone Controller</p>
          <LocalWeather />
          <p className="mt-2 text-xs text-gray-500">
            {loadingUser
              ? "Assigning user id…"
              : userId
                ? `User: ${userId}`
                : "No user id"}
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-4 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">Drone</span>
            <select
              value={droneId}
              onChange={(e) => setDroneId(e.target.value)}
              className="rounded border border-white/20 bg-black px-3 py-2 text-white"
            >
              {DRONE_OPTIONS.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={handleConnect}
            disabled={loadingUser || connecting || !droneId}
            className="rounded-lg bg-cyan-400 px-5 py-2 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {connecting ? "Connecting…" : "Connect"}
          </button>

          <Status label="Connection" value={connectionStatus} />
          <Status label="Mode" value="MANUAL" />
          <Status
            label="Assigned"
            value={assignment?.droneId || "—"}
          />
        </div>
      </header>

      {error ? (
        <p className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="relative flex aspect-video items-center justify-center rounded-xl border border-white/10 bg-black">
          <div
            className={`absolute left-4 top-4 rounded px-3 py-1 text-xs ${
              connectionStatus === "ONLINE"
                ? "bg-red-500/20"
                : "bg-white/10 text-gray-400"
            }`}
          >
            {connectionStatus === "ONLINE" ? "● LIVE" : "○ STANDBY"}
          </div>

          <div className="text-center text-gray-500">
            <p className="text-lg">Video Feed</p>
            <p className="text-sm">
              {connectionStatus === "ONLINE"
                ? `Linked to ${assignment?.droneId}`
                : "Waiting for Tello Stream"}
            </p>
          </div>

          <div className="absolute bottom-4 flex gap-2">
            {["Video", "Photo"].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setCameraMode(mode)}
                className={`rounded px-5 py-2 text-sm ${
                  cameraMode === mode
                    ? "bg-cyan-400 text-black"
                    : "bg-white/10"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <aside className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-4 text-lg font-semibold">Telemetry</h2>
          <div className="grid grid-cols-2 gap-3">
            {TELEMETRY.map((item) => (
              <div key={item.label} className="rounded-lg bg-black/30 p-3">
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="mt-1 font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <Joystick title="LEFT STICK" description="Throttle + Yaw" />
        <Joystick title="RIGHT STICK" description="Pitch + Roll" />
      </section>

      <section className="mt-4 flex justify-center gap-4">
        <button
          type="button"
          disabled={connectionStatus !== "ONLINE"}
          className="rounded-lg bg-green-500 px-8 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          TAKE OFF
        </button>
        <button
          type="button"
          disabled={connectionStatus !== "ONLINE"}
          className="rounded-lg bg-red-500 px-8 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
        >
          LAND
        </button>
      </section>
    </main>
  );
}

const WEATHER_CODES = {
  0: "Clear",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Rain showers",
  82: "Violent showers",
  95: "Thunderstorm",
};

function describeWeather(code) {
  return WEATHER_CODES[code] ?? "Local weather";
}

function LocalWeather() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async (latitude, longitude) => {
      const forecastUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}` +
        `&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m`;
      const placeUrl =
        `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}` +
        `&longitude=${longitude}&language=en&format=json`;

      const [forecastRes, placeRes] = await Promise.all([
        fetch(forecastUrl),
        fetch(placeUrl),
      ]);

      if (!forecastRes.ok) {
        throw new Error("Weather request failed");
      }

      const forecast = await forecastRes.json();
      const place = placeRes.ok ? await placeRes.json() : null;
      const result = place?.results?.[0];
      const location =
        result?.name || result?.admin1 || result?.country || "Your location";

      if (!cancelled) {
        setWeather({
          location,
          temperature: Math.round(forecast.current.temperature_2m),
          wind: Math.round(forecast.current.wind_speed_10m),
          condition: describeWeather(forecast.current.weather_code),
        });
      }
    };

    const fallbackFromIp = async () => {
      const ipRes = await fetch("https://ipwho.is/");
      const ipData = await ipRes.json();
      if (!ipData?.success || ipData.latitude == null) {
        throw new Error("Could not determine location");
      }
      await load(ipData.latitude, ipData.longitude);
    };

    const start = async () => {
      try {
        if (!navigator.geolocation) {
          await fallbackFromIp();
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              await load(
                position.coords.latitude,
                position.coords.longitude,
              );
            } catch {
              if (!cancelled) setError("Weather unavailable");
            }
          },
          async () => {
            try {
              await fallbackFromIp();
            } catch {
              if (!cancelled) setError("Weather unavailable");
            }
          },
          { timeout: 4000, maximumAge: 10 * 60 * 1000 },
        );
      } catch {
        if (!cancelled) setError("Weather unavailable");
      }
    };

    start();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="mt-2 text-xs text-gray-500">{error}</p>;
  }

  if (!weather) {
    return <p className="mt-2 text-xs text-gray-500">Loading local weather…</p>;
  }

  return (
    <p className="mt-2 text-sm text-cyan-300">
      {weather.location} · {weather.temperature}°C · {weather.condition} ·{" "}
      {weather.wind} km/h wind
    </p>
  );
}

function Status({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function Joystick({ title, description }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mb-3 text-xs text-gray-400">{description}</p>
      <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-black">
        <div className="absolute h-10 w-10 rounded-full bg-white/10" />
        <div className="grid h-full w-full grid-cols-3 grid-rows-3 text-center text-[10px] text-gray-400">
          <span />
          <span className="flex items-center justify-center">▲</span>
          <span />
          <span className="flex items-center justify-center">◀</span>
          <span className="flex items-center justify-center text-white">●</span>
          <span className="flex items-center justify-center">▶</span>
          <span />
          <span className="flex items-center justify-center">▼</span>
          <span />
        </div>
      </div>
    </div>
  );
}
