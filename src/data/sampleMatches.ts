export const sampleBookings = [
  {
    booking_id: "booking-001",
    date: "2024-08-04T18:30:00Z",
    location: "Padel Central",
    matches: [
      {
        match_id: "match-001",
        team1_player1_display_name: "Alex Rodriguez",
        team1_player1_profile_photo: "/src/assets/avatar-alex.jpg",
        team1_player2_display_name: "Sarah Johnson",
        team1_player2_profile_photo: "/src/assets/avatar-sarah.jpg",
        team2_player1_display_name: "Mike Chen",
        team2_player1_profile_photo: "/src/assets/avatar-mike.jpg",
        team2_player2_display_name: "Maria Garcia",
        team2_player2_profile_photo: "/src/assets/avatar-maria.jpg",
        total_team1_score: 2,
        total_team2_score: 1,
        sets: [
          { 
            set_number: 1, 
            team1_score: 6, 
            team2_score: 4,
            result: "WIN" as const,
            old_mmr: 1420,
            change_amount: 8,
            new_mmr: 1428
          },
          { 
            set_number: 2, 
            team1_score: 4, 
            team2_score: 6,
            result: "LOSS" as const,
            old_mmr: 1428,
            change_amount: 5,
            new_mmr: 1423
          },
          { 
            set_number: 3, 
            team1_score: 6, 
            team2_score: 2,
            result: "WIN" as const,
            old_mmr: 1423,
            change_amount: 22,
            new_mmr: 1445
          }
        ]
      }
    ]
  },
  {
    booking_id: "booking-002",
    date: "2024-08-03T16:15:00Z",
    location: "Sports Club Elite",
    matches: [
      {
        match_id: "match-002",
        team1_player1_display_name: "Alex Rodriguez",
        team1_player1_profile_photo: "/src/assets/avatar-alex.jpg",
        team1_player2_display_name: "John Smith",
        team1_player2_profile_photo: "/src/assets/avatar-john.jpg",
        team2_player1_display_name: "Sarah Johnson",
        team2_player1_profile_photo: "/src/assets/avatar-sarah.jpg",
        team2_player2_display_name: "Mike Chen",
        team2_player2_profile_photo: "/src/assets/avatar-mike.jpg",
        total_team1_score: 0,
        total_team2_score: 2,
        sets: [
          { 
            set_number: 1, 
            team1_score: 3, 
            team2_score: 6,
            result: "LOSS" as const,
            old_mmr: 1445,
            change_amount: 9,
            new_mmr: 1436
          },
          { 
            set_number: 2, 
            team1_score: 4, 
            team2_score: 6,
            result: "LOSS" as const,
            old_mmr: 1436,
            change_amount: 9,
            new_mmr: 1427
          }
        ]
      }
    ]
  },
  {
    booking_id: "booking-003",
    date: "2024-08-02T14:45:00Z",
    location: "Mauritius Padel Academy",
    matches: [
      {
        match_id: "match-003",
        team1_player1_display_name: "Alex Rodriguez",
        team1_player1_profile_photo: "/src/assets/avatar-alex.jpg",
        team1_player2_display_name: "Maria Garcia",
        team1_player2_profile_photo: "/src/assets/avatar-maria.jpg",
        team2_player1_display_name: "John Smith",
        team2_player1_profile_photo: "/src/assets/avatar-john.jpg",
        team2_player2_display_name: "Sarah Johnson",
        team2_player2_profile_photo: "/src/assets/avatar-sarah.jpg",
        total_team1_score: 2,
        total_team2_score: 0,
        sets: [
          { 
            set_number: 1, 
            team1_score: 6, 
            team2_score: 2,
            result: "WIN" as const,
            old_mmr: 1427,
            change_amount: 15,
            new_mmr: 1442
          },
          { 
            set_number: 2, 
            team1_score: 6, 
            team2_score: 4,
            result: "WIN" as const,
            old_mmr: 1442,
            change_amount: 17,
            new_mmr: 1459
          }
        ]
      }
    ]
  }
];