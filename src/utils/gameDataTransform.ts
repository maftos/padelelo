import { format, addHours, isSameDay, addDays } from "date-fns";
import { PublicOpenGame } from "@/hooks/use-public-open-games";

export const formatGameDate = (date: Date) => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = dayNames[date.getDay()];
  
  if (diffDays === 1) {
    return `Tomorrow, ${date.getDate()}${getOrdinalSuffix(date.getDate())} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
  } else if (diffDays <= 7) {
    return `Next ${dayName}, ${date.getDate()}${getOrdinalSuffix(date.getDate())} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
  } else {
    return `${dayName}, ${date.getDate()}${getOrdinalSuffix(date.getDate())} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
  }
};

export const formatGameDateTime = (date: Date) => {
  // Ensure we treat the input as UTC and convert to Mauritius time (UTC+4)
  // Create a new date that represents the same UTC moment
  const utcTime = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
  const mauritiusDate = addHours(utcTime, 4);
  
  // Get current time in UTC, then convert to Mauritius timezone
  const nowUtc = new Date();
  const nowUtcAdjusted = new Date(nowUtc.getTime() + (nowUtc.getTimezoneOffset() * 60000));
  const nowMauritius = addHours(nowUtcAdjusted, 4);
  
  const time = format(mauritiusDate, "HH:mm");
  
  // Check if it's today in Mauritius timezone
  if (isSameDay(mauritiusDate, nowMauritius)) {
    return `Today @ ${time}`;
  }
  
  // Check if it's tomorrow in Mauritius timezone
  const tomorrowMauritius = addDays(nowMauritius, 1);
  if (isSameDay(mauritiusDate, tomorrowMauritius)) {
    return `Tomorrow @ ${time}`;
  }
  
  // Otherwise show day name and date
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = dayNames[mauritiusDate.getDay()];
  const monthName = mauritiusDate.toLocaleDateString('en-US', { month: 'short' });
  
  return `${dayName}, ${monthName} ${mauritiusDate.getDate()} @ ${time}`;
};

export const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

export const formatTimeAgo = (date: Date) => {
  // Convert both dates to UTC first, then to Mauritius timezone for consistent comparison
  const createdAtUtc = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
  const createdAtMauritius = addHours(createdAtUtc, 4);
  
  const nowUtc = new Date();
  const nowUtcAdjusted = new Date(nowUtc.getTime() + (nowUtc.getTimezoneOffset() * 60000));
  const nowMauritius = addHours(nowUtcAdjusted, 4);
  
  const diffMs = nowMauritius.getTime() - createdAtMauritius.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return "yesterday";
  } else {
    return `${diffDays}d ago`;
  }
};

export const calculateAverageMMR = (players: Array<{ current_mmr: number } | null>) => {
  const validPlayers = players.filter(player => player !== null && player.current_mmr !== undefined) as Array<{ current_mmr: number }>;
  if (validPlayers.length === 0) return 0;
  const total = validPlayers.reduce((sum, player) => sum + player.current_mmr, 0);
  return Math.round(total / validPlayers.length);
};

export const transformPublicOpenGameToUIFormat = (game: PublicOpenGame, currentUserId?: string) => {
  const remainingSpots = 4 - game.player_count;
  const gameDate = new Date(game.start_time);
  const createdAt = new Date(game.created_at);
  
  // Create existingPlayers array with actual participants and null slots
  const existingPlayers = Array(4).fill(null);
  
  // Fill in actual participants with proper MMR and full names
  game.participants.forEach((participant, index) => {
    if (index < 4) {
      existingPlayers[index] = {
        id: participant.player_id,
        name: `${participant.first_name} ${participant.last_name || ''}`.trim(),
        current_mmr: participant.current_mmr || 3000,
        avatar: participant.profile_photo,
      };
    }
  });
  
  // Get price from first participant's payment amount
  const priceAmount = game.participants[0]?.payment_amount || 400;
  const priceCurrency = game.participants[0]?.payment_currency || 'MUR';
  const formattedPrice = `Rs ${priceAmount}`;
  
  return {
    id: game.booking_id,
    title: `Looking for ${remainingSpots} player${remainingSpots !== 1 ? 's' : ''} - open booking`,
    courtName: game.venue_name,
    venueId: game.venue_id,
    gameDate,
    spotsAvailable: remainingSpots,
    description: game.description,
    publishedAt: createdAt,
    existingPlayers,
    createdBy: game.created_by,
    price: formattedPrice,
    startTime: format(gameDate, "HH:mm"),
    createdAt
  };
};
