import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
// Interfaces
interface Team {
  id: string;
  name: string;
  logo: string;
  stadium: string;
}

interface Match {
  week: number;
  matchNumber: number;
  homeTeam: Team;
  awayTeam: Team;
  homeTeamLogo: string;
  awayTeamLogo: string;
  date: Date;
  time: string;
  stadium: string;
  homeScore?: number;
  awayScore?: number;
  isPlayed?: boolean;
  scoreDisplay?: string;
}

interface FixtureData {
  season: string;
  league: string;
  totalWeeks: number;
  totalMatches: number;
  fixtures: Array<{
    week: number;
    matches: Array<{
      home: string;
      away: string;
    }>;
  }>;
}

// Mapping for fixture names to team names
interface FixtureNameMapping {
  [fixtureName: string]: string;
}

interface TeamsData {
  teams: Team[];
}

interface StadiumsData {
  stadiums: { [key: string]: string };
}

interface ApiFixtureResponse {
  week: number;
  matches: Array<{
    dateTime: string | number | Date;
    homeTeam: Team;
    awayTeam: Team;
    date: string;
    time: string;
    stadium: string;
    homeScore?: number;
    awayScore?: number;
    isPlayed?: boolean;
    scoreDisplay?: string;
  }>;
}

@Component({
  selector: 'app-fixtures',
  imports: [CommonModule],
  templateUrl: './fixtures.html',
  styleUrl: './fixtures.scss'
})
export class Fixtures implements OnInit, OnDestroy {
  // Component properties
  teams: Team[] = [];
  stadiums: { [key: string]: string } = {};
  fixtureNameMapping: FixtureNameMapping = {};
  currentWeek = 1;
  totalWeeks = 34;
  fixtureData: Match[][] = [];
  selectedTeam: Team | null = null;
  isLoading = true;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTeamsAndGenerateFixture();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  // Load teams from JSON and generate fixture
  async loadTeamsAndGenerateFixture(): Promise<void> {
    try {
      this.isLoading = true;
      this.error = '';

      // Load teams data
      const teamsData = await this.http.get<TeamsData>('/data/teams.json').toPromise();
      if (teamsData) {
        this.teams = teamsData.teams;
      }

      // Load stadiums data
      try {
        const stadiumsData = await this.http.get<StadiumsData>('/data/stadiums.json').toPromise();
        if (stadiumsData) {
          this.stadiums = stadiumsData.stadiums;
          //console.log('Stadiums data loaded successfully:', this.stadiums);
        }
      } catch (error) {
        //console.warn('Could not load stadiums.json, using fallback stadium data:', error);
        // Fallback to empty stadiums object
        this.stadiums = {};
      }

      // Initialize fixture name mapping
      this.initializeFixtureNameMapping();

      // Initialize the page
      this.showWeek(1);
      this.isLoading = false;

    } catch (error) {
      console.error('Error loading data:', error);
      this.error = 'Veriler yüklenirken hata oluştu.';
      this.isLoading = false;
    }
  }

  // Load fixtures for a specific week from API
  async loadWeekFixtures(week: number): Promise<void> {
    try {
      this.isLoading = true;
      this.error = '';

      console.log(`Loading fixtures for week ${week} from API...`);


      const response = await this.http.get<ApiFixtureResponse>(`${environment.apiUrl}/api/Fixtures/week/${week}`).toPromise();

      if (response) {
        //console.log(`API response for week ${week}:`, response);
        // Convert API response to Match format
        console.log('Berkay8', response.matches);
        const weekMatches: Match[] = response.matches.map((match, index) => ({
          week: response.week,
          matchNumber: index + 1,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          homeTeamLogo: this.getTeamLogo(match.homeTeam as unknown as string),
          awayTeamLogo: this.getTeamLogo(match.awayTeam as unknown as string),
          //date: new Date(match.date),
          date: new Date(this.trDotDateToIso(match.date as string)),
          time: match.time,
          stadium: (() => {
            // First map fixture name to team name, then look up stadium
            const teamName = this.fixtureNameMapping[match.homeTeam as unknown as string] || match.homeTeam as unknown as string;
            const mappedStadium = this.stadiums[teamName];
            if (mappedStadium) {
              //console.log(`Mapped stadium for ${this.formatTeamName(match.homeTeam.name)} (${this.formatTeamName(teamName)}): ${mappedStadium}`);
              return mappedStadium;
            } else {
              //console.log(`No stadium mapping found for ${this.formatTeamName(match.homeTeam.name)} (${this.formatTeamName(teamName)}), using fallback: ${match.homeTeam.stadium || ''}`);
              return match.homeTeam.stadium || '';
            }
          })(),
          homeScore: match.homeScore,
          awayScore: match.awayScore,
          isPlayed: match.isPlayed,
          scoreDisplay: match.scoreDisplay,
        }));

        // Update fixture data for this week
        if (this.fixtureData[week - 1]) {
          this.fixtureData[week - 1] = weekMatches;
        } else {
          // If week doesn't exist, create it
          while (this.fixtureData.length < week) {
            this.fixtureData.push([]);
          }
          this.fixtureData[week - 1] = weekMatches;
        }
      }

      this.isLoading = false;
    } catch (error) {
      console.error('Error loading week fixtures:', error);
      // Fallback to JSON data if API is not available
      if (this.fixtureData.length > 0 && this.fixtureData[week - 1]) {
        console.log('Falling back to JSON data for week', week);
        this.error = '';
      } else {
        this.error = `${week}. hafta fikstürü yüklenirken hata oluştu.`;
      }
      this.isLoading = false;
    }
  }

  // Show matches for a specific week
  async showWeek(week: number): Promise<void> {
    this.currentWeek = week;
    // Load fixtures for the selected week from API
    await this.loadWeekFixtures(week);
  }

  trDotDateToIso(
    dateStr: string,          // "23.08.2025"
    timeStr: string = "00:00:00" // "21:30:00" da verebilirsin
  ): string {
    const m = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (!m) throw new Error("Geçersiz tarih formatı. Beklenen: dd.MM.yyyy");
    let [, dd, MM, yyyy] = m;
  
    const [hh = "00", mi = "00", ss = "00"] = timeStr.split(":");
  
    const pad = (v: string | number) => String(v).padStart(2, "0");
    return `${yyyy}-${pad(MM)}-${pad(dd)}T${pad(hh)}:${pad(mi)}:${pad(ss)}`;
  }

  // Get matches for current week
  getCurrentWeekMatches(): Match[] {
    if (this.fixtureData.length === 0 || this.currentWeek > this.fixtureData.length) {
      return [];
    }
    return this.fixtureData[this.currentWeek - 1] || [];
  }

  // Get filtered matches for selected team
  getFilteredMatches(): Match[] {
    const matches = this.getCurrentWeekMatches();
    
    if (!this.selectedTeam) {
      return matches;
    }

    return matches.filter(match => 
      match.homeTeam.id === this.selectedTeam!.id || match.awayTeam.id === this.selectedTeam!.id
    );
  }

  // Select team
  selectTeam(team: Team): void {
    this.selectedTeam = team;
  }

  // Clear team selection
  clearTeamSelection(): void {
    this.selectedTeam = null;
  }

  // Check if team is selected
  isTeamSelected(team: Team): boolean {
    return this.selectedTeam?.id === team.id;
  }

  // Check if match team is selected
  isMatchTeamSelected(team: Team): boolean {
    return this.selectedTeam?.id === team.id;
  }

  // Check if match has scores
  hasScores(match: Match): boolean {
    return match.isPlayed === true && (match.homeScore !== undefined || match.awayScore !== undefined);
  }

  // Get score display text
  getScoreDisplay(match: Match): string {
    if (match.scoreDisplay) {
      return match.scoreDisplay;
    }
    if (this.hasScores(match)) {
      return `${match.homeScore || 0} - ${match.awayScore || 0}`;
    }
    return 'VS';
  }

  // Navigation methods
  async previousWeek(): Promise<void> {
    if (this.currentWeek > 1) {
      await this.showWeek(this.currentWeek - 1);
    }
  }

  async nextWeek(): Promise<void> {
    if (this.currentWeek < this.totalWeeks) {
      await this.showWeek(this.currentWeek + 1);
    }
  }

  // Check if navigation buttons should be disabled
  isPreviousWeekDisabled(): boolean {
    return this.currentWeek === 1;
  }

  isNextWeekDisabled(): boolean {
    return this.currentWeek === this.totalWeeks;
  }

  // Generate week numbers for selector
  getWeekNumbers(): number[] {
    return Array.from({ length: this.totalWeeks }, (_, i) => i + 1);
  }

  // Format date for display
  formatDate(date: Date): string {
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Get no matches message
  getNoMatchesMessage(): string {
    if (this.selectedTeam) {
      return `${this.selectedTeam.name} için bu hafta maç bulunamadı.`;
    }
    return 'Bu hafta için maç bulunamadı.';
  }

  // Mobile menu functionality
  toggleMobileMenu(): void {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('active');
    }
  }

  // Handle logo loading errors
  onImageError(event: any): void {
    const img = event.target;
    // Add error class for styling instead of hiding
    img.classList.add('error');
    console.warn('Logo failed to load for team:', img.alt);
    
    // If no logo URL, hide the image
    if (!img.src || img.src === '') {
      img.style.display = 'none';
    }
  }

  // Format team name to sentence case
  formatTeamName(name: string): string {
    if (!name) return name;
    
    // Handle common abbreviations and special cases
    const abbreviations = ['A.Ş.', 'F.K.', 'SK', 'F.A.Ş.'];
    const specialWords = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Trabzon', 'Konya', 'Kayseri', 'Gaziantep'];
    
    // Split the string into words
    let words = name.split(' ');
    
    // Process each word
    words = words.map((word, index) => {
      // Keep abbreviations as is
      if (abbreviations.includes(word)) {
        return word;
      }
      
      // Keep special city names as is
      if (specialWords.includes(word)) {
        return word;
      }
      
      // Handle Turkish characters for first letter
      if (index === 0) {
        // First word: capitalize first letter
        if (word.startsWith('İ')) {
          return 'İ' + word.slice(1).toLowerCase();
        } else if (word.startsWith('I')) {
          return 'I' + word.slice(1).toLowerCase();
        } else {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
      } else {
        // Other words: lowercase
        return word.toLowerCase();
      }
    });
    
    return words.join(' ');
  }

  // Get team logo from teams data
  getTeamLogo(teamName: string): string {
    //console.log('Berkay', this.teams);
    //console.log('Berkay', teamName);
    // First try to find by exact name match
    let team = this.teams.find(t => t.name === teamName);
    if (!team) {
      // If not found, try to map fixture name to team name
      const mappedName = this.fixtureNameMapping[teamName];
      if (mappedName) {
        team = this.teams.find(t => t.name === mappedName);
      }
    }
    
    if (team) {
      //console.log(`Found logo for ${teamName}: ${team.logo}`);
      return team.logo;
    } else {
      //console.warn(`No logo found for team: ${teamName}`);
      // Return a default logo or empty string
      return '';
    }
  }

  // Initialize fixture name mapping
  private initializeFixtureNameMapping(): void {
    this.fixtureNameMapping = {
      "Kayserispor F.A.Ş.": "Kayserispor F.A.Ş.",
      "KAYSERİSPOR FUTBOL A.Ş.": "Kayserispor F.A.Ş.",
      "ZECORNER KAYSERİSPOR": "Kayserispor F.A.Ş.",
      "Galatasaray A.Ş.": "Galatasaray A.Ş.",
      "GALATASARAY A.Ş.": "Galatasaray A.Ş.",
      "SAMSUNSPOR A.Ş.": "Samsunspor A.Ş.",
      "GÖZTEPE A.Ş.": "Göztepe A.Ş.",
      "Konyaspor": "Konyaspor",
      "TÜMOSAN KONYASPOR": "Konyaspor",
      "Antalyaspor A.Ş.": "Antalyaspor A.Ş.",
      "HESAP.COM ANTALYASPOR": "Antalyaspor A.Ş.",
      "Trabzonspor A.Ş.": "Trabzonspor A.Ş.",
      "TRABZONSPOR A.Ş.": "Trabzonspor A.Ş.",
      "C. Alanyaspor": "C. Alanyaspor",
      "CORENDON ALANYASPOR": "C. Alanyaspor",
      "Fenerbahçe A.Ş.": "Fenerbahçe A.Ş.",
      "FENERBAHÇE A.Ş.": "Fenerbahçe A.Ş.",
      "Ç. Rizespor A.Ş.": "Ç. Rizespor A.Ş.",
      "ÇAYKUR RİZESPOR A.Ş.": "Ç. Rizespor A.Ş.",
      "Beşiktaş A.Ş.": "Beşiktaş A.Ş.",
      "BEŞİKTAŞ A.Ş.": "Beşiktaş A.Ş.",
      "R. Başakşehir F.K.": "R. Başakşehir F.K.",
      "RAMS BAŞAKŞEHİR FUTBOL KULÜBÜ": "R. Başakşehir F.K.",
      "Gençlerbirliği": "Gençlerbirliği",
      "GENÇLERBİRLİĞİ": "Gençlerbirliği",
      "Kasımpaşa A.Ş.": "Kasımpaşa A.Ş.",
      "KASIMPAŞA A.Ş.": "Kasımpaşa A.Ş.",
      "Kocaelispor": "Kocaelispor",
      "KOCAELİSPOR": "Kocaelispor",
      "İ. Eyüpspor": "İ. Eyüpspor",
      "İKAS EYÜPSPOR": "İ. Eyüpspor",
      "F. Karagümrük A.Ş.": "F. Karagümrük A.Ş.",
      "FATİH KARAGÜMRÜK A.Ş.": "F. Karagümrük A.Ş.",
      "Gaziantep F.K. A.Ş.": "Gaziantep F.K. A.Ş.",
      "GAZİANTEP FUTBOL KULÜBÜ A.Ş.": "Gaziantep F.K. A.Ş."
    };
  }
}
