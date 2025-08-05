export const sampleBookings = [
  {
    booking_id: "booking-001",
    date: "2025-01-15T18:30:00Z",
    location: "Padel Central Tournament",
    status: "MMR_CALCULATED" as const,
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
            change_amount: 8
          },
          { 
            set_number: 2, 
            team1_score: 4, 
            team2_score: 6,
            result: "LOSS" as const,
            change_amount: 5
          },
          { 
            set_number: 3, 
            team1_score: 6, 
            team2_score: 2,
            result: "WIN" as const,
            change_amount: 22
          }
        ]
      },
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
            change_amount: 12
          },
          { 
            set_number: 2, 
            team1_score: 4, 
            team2_score: 6,
            result: "LOSS" as const,
            change_amount: 8
          }
        ]
      },
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
            change_amount: 18
          },
          { 
            set_number: 2, 
            team1_score: 6, 
            team2_score: 4,
            result: "WIN" as const,
            change_amount: 15
          }
        ]
      }
    ]
  },
  {
    booking_id: "booking-003",
    date: "2025-01-10T14:45:00Z",
    location: "Mauritius Padel Academy",
    status: "SCORE_RECORDED" as const,
    matches: [
      {
        match_id: "match-004",
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
            result: null,
            change_amount: null
          },
          { 
            set_number: 2, 
            team1_score: 6, 
            team2_score: 4,
            result: null,
            change_amount: null
          }
        ]
      }
    ]
  }
];