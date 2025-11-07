
'use client';

import { useState, useEffect } from 'react';
import { MdWbSunny, MdCloud, MdWaterDrop, MdAir } from 'react-icons/md';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
  icon: string;
}

interface ForecastDay {
  date: string;
  dayOfWeek: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeather();
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 1800000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      // Use Chicago as default location for Montrecott
      const location = 'Chicago,IL,US';
      
      const response = await fetch(`https://wttr.in/${location}?format=j1`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      const current = data.current_condition[0];
      
      setWeather({
        temperature: parseInt(current.temp_F),
        condition: current.weatherDesc[0].value,
        humidity: parseInt(current.humidity),
        windSpeed: parseInt(current.windspeedMiles),
        location: 'Chicago, IL',
        icon: getWeatherIcon(current.weatherDesc[0].value),
      });

      // Process 7-day forecast
      const forecastData: ForecastDay[] = data.weather.slice(0, 7).map((day: any) => {
        const date = new Date(day.date);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        return {
          date: day.date,
          dayOfWeek,
          high: parseInt(day.maxtempF),
          low: parseInt(day.mintempF),
          condition: day.hourly[4]?.weatherDesc[0]?.value || 'Partly Cloudy',
          icon: getWeatherIcon(day.hourly[4]?.weatherDesc[0]?.value || 'Partly Cloudy'),
        };
      });
      
      setForecast(forecastData);
      setError(null);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Unable to load weather');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string): string => {
    const cond = condition.toLowerCase();
    if (cond.includes('sunny') || cond.includes('clear')) return '☀️';
    if (cond.includes('cloud')) return '☁️';
    if (cond.includes('rain')) return '🌧️';
    if (cond.includes('snow')) return '❄️';
    if (cond.includes('storm') || cond.includes('thunder')) return '⛈️';
    if (cond.includes('fog') || cond.includes('mist')) return '🌫️';
    return '🌤️';
  };

  if (loading) {
    return (
      <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/30 hover:border-border/50 transition-all">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-muted/50 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-muted/50 rounded animate-pulse w-1/2" />
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/30">
        <div className="flex items-center gap-3 text-muted-foreground">
          <MdCloud className="w-8 h-8 opacity-50" />
          <div className="text-sm">{error}</div>
        </div>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/30 hover:border-border/50 transition-all cursor-pointer group">
        <div className="space-y-3">
          {/* Temperature and Condition */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{weather.icon}</div>
              <div>
                <div className="text-3xl font-semibold text-foreground">
                  {weather.temperature}°F
                </div>
                <div className="text-sm text-muted-foreground">
                  {weather.condition}
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border/30 pt-2">
            <MdWbSunny className="w-3.5 h-3.5" />
            <span>{weather.location}</span>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-2 pt-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MdWaterDrop className="w-3.5 h-3.5" />
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MdAir className="w-3.5 h-3.5" />
              <span>{weather.windSpeed} mph</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 7-Day Forecast */}
      {forecast.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            7-Day Forecast
          </h4>
          <div className="space-y-1">
            {forecast.map((day, index) => (
              <div
                key={day.date}
                className={cn(
                  "flex items-center justify-between p-2.5 rounded-lg transition-all",
                  "hover:bg-card/60 hover:border-border/50",
                  index === 0 ? "bg-card/40 border border-border/30" : "bg-card/20 border border-transparent"
                )}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs font-medium text-foreground w-8 flex-shrink-0">
                    {index === 0 ? 'Today' : day.dayOfWeek}
                  </span>
                  <div className="text-lg flex-shrink-0">{day.icon}</div>
                  <span className="text-xs text-muted-foreground truncate flex-1">
                    {day.condition}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-semibold text-foreground">
                    {day.high}°
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {day.low}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
