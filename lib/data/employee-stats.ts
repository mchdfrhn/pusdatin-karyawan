export type StatusKey = "PNS" | "CPNS" | "PPPK" | "PPnPN" | "KI";

export type StatusCounts = Record<StatusKey, number>;

export type EmployeeSummary = {
  totalEmployees: number;
  maleEmployees: number;
  femaleEmployees: number;
  statusCounts: StatusCounts;
};

export type AgeRow = {
  range: string;
  pns: number;
  cpns: number;
  pppk: number;
  ki: number;
  total: number;
};

export type EducationRow = {
  level: string;
  pns: number;
  cpns: number;
  pppk: number;
  ki: number;
  total: number;
};

export type PositionRow = {
  position: string;
  male: number;
  female: number;
};

export type DepartmentRow = {
  dept: string;
  male: number;
  female: number;
};

export type GenderAgeRow = {
  age: string;
  male: number;
  female: number;
};

export type CategoryRow = {
  name: string;
  value: number;
  color: string;
};

export type EmployeeStats = {
  summary: EmployeeSummary;
  ageData: AgeRow[];
  ageCategoryData: CategoryRow[];
  educationData: EducationRow[];
  educationChart: CategoryRow[];
  positionData: PositionRow[];
  positionCategory: CategoryRow[];
  departmentData: DepartmentRow[];
  departmentCategory: CategoryRow[];
  genderAgeData: GenderAgeRow[];
  genderCategory: CategoryRow[];
};

const AGE_BUCKETS = ["20-30", "31-40", "41-50", "51+"] as const;
const EDUCATION_LEVELS = ["SLTA", "D1-D3", "S1-D4", "S2", "S3"] as const;

const STATUS_ORDER: StatusKey[] = ["PNS", "CPNS", "PPPK", "KI", "PPnPN"];
const STATUS_COLORS: Record<StatusKey, string> = {
  PNS: "#10b981",
  CPNS: "#a855f7",
  PPPK: "#f59e0b",
  PPnPN: "#ec4899",
  KI: "#06b6d4",
};

const EDUCATION_COLORS: Record<(typeof EDUCATION_LEVELS)[number], string> = {
  SLTA: "#3b82f6",
  "D1-D3": "#8b5cf6",
  "S1-D4": "#ec4899",
  S2: "#f59e0b",
  S3: "#10b981",
};

const CATEGORY_PALETTE = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#14b8a6",
  "#f97316",
];

const STATUS_ALIASES: Record<StatusKey, string[]> = {
  PNS: ["pns", "pegawai negeri sipil"],
  CPNS: ["cpns", "calon pegawai negeri sipil"],
  PPPK: ["pppk", "pegawai pemerintah dengan perjanjian kerja"],
  PPnPN: [
    "ppnpn",
    "ppn pn",
    "pegawai pemerintah non pns",
    "pegawai pemerintah non pegawai negara",
  ],
  KI: [
    "ki",
    "karyawan insidental",
    "karyawan insidentil",
    "karyawan incidental",
  ],
};

const FIELD_ALIASES = {
  status: [
    "status",
    "status_pegawai",
    "statuspegawai",
    "status_kepegawaian",
    "statuskepegawaian",
    "status_kepeg",
    "employee_status",
    "employment_status",
    "kategori",
    "kategori_pegawai",
    "kategoripegawai",
    "jenis_pegawai",
    "jenispegawai",
  ],
  gender: ["gender", "jenis_kelamin", "jeniskelamin", "kelamin", "sex", "jk"],
  age: [
    "age",
    "umur",
    "usia",
    "age_years",
    "ageyears",
    "usia_tahun",
    "umur_tahun",
    "usia_pegawai",
    "umur_pegawai",
  ],
  birthDate: [
    "tanggal_lahir",
    "tanggallahir",
    "tgl_lahir",
    "tgllahir",
    "birth_date",
    "birthdate",
    "date_of_birth",
    "dob",
  ],
  education: [
    "education",
    "pendidikan",
    "pendidikan_terakhir",
    "pendidikanterakhir",
    "pendidikan_akhir",
    "pendidikanakhir",
    "pendidikan_tertinggi",
    "education_level",
    "tingkat_pendidikan",
    "tingkatpendidikan",
  ],
  position: [
    "position",
    "jabatan",
    "job_title",
    "jobtitle",
    "jabatan_name",
    "jabatanname",
    "position_name",
    "jabatan_akhir",
    "jabatanakhir",
  ],
  department: [
    "department",
    "golongan",
    "grade",
    "rank",
    "golongan_ruang",
    "golonganruang",
    "gol_ruang",
  ],
  eselon: ["eselon"],
} as const;

const FIELD_SETS = {
  status: new Set(FIELD_ALIASES.status),
  gender: new Set(FIELD_ALIASES.gender),
  age: new Set(FIELD_ALIASES.age),
  birthDate: new Set(FIELD_ALIASES.birthDate),
  education: new Set(FIELD_ALIASES.education),
  position: new Set(FIELD_ALIASES.position),
  department: new Set(FIELD_ALIASES.department),
  eselon: new Set(FIELD_ALIASES.eselon),
};

const FIELD_OVERRIDES = {
  status: process.env.NEXT_PUBLIC_EMPLOYEE_FIELD_STATUS,
  gender: process.env.NEXT_PUBLIC_EMPLOYEE_FIELD_GENDER,
  age: process.env.NEXT_PUBLIC_EMPLOYEE_FIELD_AGE,
  birthDate: process.env.NEXT_PUBLIC_EMPLOYEE_FIELD_BIRTHDATE,
  education: process.env.NEXT_PUBLIC_EMPLOYEE_FIELD_EDUCATION,
  position: process.env.NEXT_PUBLIC_EMPLOYEE_FIELD_POSITION,
  department: process.env.NEXT_PUBLIC_EMPLOYEE_FIELD_DEPARTMENT,
  eselon: "eselon",
};

export type RawRow = Record<string, unknown>;
type GenderKey = "male" | "female";
type StatusFieldKey = "pns" | "cpns" | "pppk" | "ki";

const fallbackAgeData: AgeRow[] = [
  { range: "20-30", pns: 5, cpns: 8, pppk: 12, ki: 45, total: 70 },
  { range: "31-40", pns: 17, cpns: 2, pppk: 11, ki: 32, total: 62 },
  { range: "41-50", pns: 15, cpns: 0, pppk: 0, ki: 7, total: 22 },
  { range: "51+", pns: 4, cpns: 2, pppk: 0, ki: 21, total: 27 },
];

const fallbackAgeCategoryData: CategoryRow[] = [
  { name: "PNS", value: 41, color: STATUS_COLORS.PNS },
  { name: "CPNS", value: 12, color: STATUS_COLORS.CPNS },
  { name: "PPPK", value: 23, color: STATUS_COLORS.PPPK },
  { name: "KI", value: 105, color: STATUS_COLORS.KI },
];

const fallbackEducationData: EducationRow[] = [
  { level: "SLTA", pns: 5, cpns: 1, pppk: 8, ki: 9, total: 23 },
  { level: "D1-D3", pns: 8, cpns: 2, pppk: 4, ki: 18, total: 32 },
  { level: "S1-D4", pns: 20, cpns: 8, pppk: 8, ki: 65, total: 101 },
  { level: "S2", pns: 8, cpns: 1, pppk: 3, ki: 10, total: 22 },
  { level: "S3", pns: 0, cpns: 0, pppk: 0, ki: 3, total: 3 },
];

const fallbackEducationChart: CategoryRow[] = [
  { name: "SLTA", value: 23, color: EDUCATION_COLORS.SLTA },
  { name: "D1-D3", value: 32, color: EDUCATION_COLORS["D1-D3"] },
  { name: "S1-D4", value: 101, color: EDUCATION_COLORS["S1-D4"] },
  { name: "S2", value: 22, color: EDUCATION_COLORS.S2 },
  { name: "S3", value: 3, color: EDUCATION_COLORS.S3 },
];

const fallbackPositionData: PositionRow[] = [
  { position: "Eselon II", male: 0, female: 1 },
  { position: "Eselon III", male: 2, female: 2 },
  { position: "Eselon IV", male: 0, female: 0 },
  { position: "JFT", male: 54, female: 2 },
  { position: "JFU", male: 13, female: 2 },
];

const fallbackPositionCategory: CategoryRow[] = [
  { name: "JFT", value: 56, color: CATEGORY_PALETTE[0] },
  { name: "JFU", value: 15, color: CATEGORY_PALETTE[1] },
  { name: "Eselon III", value: 4, color: CATEGORY_PALETTE[2] },
  { name: "Eselon II", value: 1, color: CATEGORY_PALETTE[3] },
];

const fallbackDepartmentData: DepartmentRow[] = [
  { dept: "III", male: 2, female: 0 },
  { dept: "III/a", male: 18, female: 6 },
  { dept: "III/b", male: 6, female: 2 },
  { dept: "III/c", male: 8, female: 2 },
  { dept: "III/d", male: 4, female: 2 },
  { dept: "IV/a", male: 3, female: 0 },
  { dept: "IV/b", male: 3, female: 0 },
  { dept: "IV/c", male: 22, female: 5 },
  { dept: "V", male: 21, female: 8 },
  { dept: "V/a", male: 6, female: 1 },
  { dept: "V/b", male: 3, female: 0 },
  { dept: "VI", male: 7, female: 7 },
];

const fallbackDepartmentCategory: CategoryRow[] = fallbackDepartmentData.map(
  (item, index) => ({
    name: item.dept,
    value: item.male + item.female,
    color: CATEGORY_PALETTE[index % CATEGORY_PALETTE.length],
  }),
);

const fallbackGenderAgeData: GenderAgeRow[] = [
  { age: "20-30", male: 45, female: 25 },
  { age: "31-40", male: 48, female: 14 },
  { age: "41-50", male: 20, female: 2 },
  { age: "51+", male: 15, female: 12 },
];

const fallbackGenderCategory: CategoryRow[] = [
  { name: "Laki-laki", value: 128, color: "#3b82f6" },
  { name: "Perempuan", value: 53, color: "#ec4899" },
];

export const fallbackStats: EmployeeStats = {
  summary: {
    totalEmployees: 181,
    maleEmployees: 128,
    femaleEmployees: 53,
    statusCounts: {
      PNS: 41,
      CPNS: 12,
      PPPK: 23,
      PPnPN: 0,
      KI: 105,
    },
  },
  ageData: fallbackAgeData,
  ageCategoryData: fallbackAgeCategoryData,
  educationData: fallbackEducationData,
  educationChart: fallbackEducationChart,
  positionData: fallbackPositionData,
  positionCategory: fallbackPositionCategory,
  departmentData: fallbackDepartmentData,
  departmentCategory: fallbackDepartmentCategory,
  genderAgeData: fallbackGenderAgeData,
  genderCategory: fallbackGenderCategory,
};

const STATUS_TO_FIELD: Partial<Record<StatusKey, StatusFieldKey>> = {
  PNS: "pns",
  CPNS: "cpns",
  PPPK: "pppk",
  KI: "ki",
};

function pickField(
  row: RawRow,
  aliases: Set<string>,
  override?: string,
): unknown {
  if (override) {
    const overrideKey = Object.keys(row).find(
      (key) => key.toLowerCase() === override.toLowerCase(),
    );
    if (overrideKey) {
      return row[overrideKey];
    }
  }
  for (const key of Object.keys(row)) {
    if (aliases.has(key.toLowerCase())) {
      return row[key];
    }
  }
  return null;
}

function matchAlias(value: string, alias: string): boolean {
  const normalized = value.replace(/[^a-z0-9]+/g, " ").trim();
  if (!normalized) {
    return false;
  }
  if (alias.length <= 4) {
    return (
      normalized === alias || new RegExp(`\\b${alias}\\b`).test(normalized)
    );
  }
  return normalized === alias || normalized.includes(alias);
}

function normalizeStatus(value: unknown): StatusKey | null {
  if (value === null || value === undefined) {
    return null;
  }
  const raw = String(value).trim().toLowerCase();
  if (!raw) {
    return null;
  }
  for (const key of STATUS_ORDER) {
    const aliases = STATUS_ALIASES[key];
    for (const alias of aliases) {
      if (matchAlias(raw, alias)) {
        return key;
      }
    }
  }
  return null;
}

function normalizeGender(value: unknown): GenderKey | null {
  if (value === null || value === undefined) {
    return null;
  }
  const raw = String(value).trim().toLowerCase();
  if (!raw) {
    return null;
  }
  if (
    raw === "l" ||
    raw === "lk" ||
    raw === "m" ||
    raw === "male" ||
    raw === "pria" ||
    raw === "laki" ||
    raw === "laki-laki"
  ) {
    return "male";
  }
  if (
    raw === "p" ||
    raw === "pr" ||
    raw === "f" ||
    raw === "female" ||
    raw === "wanita" ||
    raw === "perempuan"
  ) {
    return "female";
  }
  if (raw.includes("laki")) {
    return "male";
  }
  if (raw.includes("perempuan") || raw.includes("wanita")) {
    return "female";
  }
  return null;
}

function parseDateValue(value: unknown): Date | null {
  if (value instanceof Date && Number.isFinite(value.getTime())) {
    return value;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value > 1_000_000_000_000) {
      const date = new Date(value);
      return Number.isFinite(date.getTime()) ? date : null;
    }
    if (value > 1_000_000_000) {
      const date = new Date(value * 1000);
      return Number.isFinite(date.getTime()) ? date : null;
    }
    const currentYear = new Date().getFullYear();
    if (value >= 1900 && value <= currentYear + 1) {
      return new Date(value, 0, 1);
    }
  }
  if (typeof value !== "string") {
    return null;
  }
  const raw = value.trim();
  if (!raw) {
    return null;
  }

  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const date = new Date(raw);
    return Number.isFinite(date.getTime()) ? date : null;
  }

  const dmyMatch = raw.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
  if (dmyMatch) {
    const day = Number(dmyMatch[1]);
    const month = Number(dmyMatch[2]);
    const year = Number(dmyMatch[3]);
    const date = new Date(year, month - 1, day);
    return Number.isFinite(date.getTime()) ? date : null;
  }

  const ymdMatch = raw.match(/^(\d{4})[\/.-](\d{1,2})[\/.-](\d{1,2})$/);
  if (ymdMatch) {
    const year = Number(ymdMatch[1]);
    const month = Number(ymdMatch[2]);
    const day = Number(ymdMatch[3]);
    const date = new Date(year, month - 1, day);
    return Number.isFinite(date.getTime()) ? date : null;
  }

  const parsed = Date.parse(raw);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed);
  }

  return null;
}

function ageFromDate(date: Date): number | null {
  if (!Number.isFinite(date.getTime())) {
    return null;
  }
  const now = new Date();
  let age = now.getFullYear() - date.getFullYear();
  const monthDiff = now.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < date.getDate())) {
    age -= 1;
  }
  if (age < 0 || age > 150) {
    return null;
  }
  return age;
}

function parseAgeValue(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value > 0 && value <= 150) {
      return Math.floor(value);
    }
    const dateFromNumber = parseDateValue(value);
    if (dateFromNumber) {
      return ageFromDate(dateFromNumber);
    }
  }
  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) {
      return null;
    }
    const ageMatch = raw.match(/(\d{1,3})\s*(tahun|thn|th)\b/);
    if (ageMatch) {
      const parsed = Number(ageMatch[1]);
      return parsed > 0 && parsed <= 150 ? parsed : null;
    }
    if (/^\d{1,3}$/.test(raw)) {
      const parsed = Number(raw);
      return parsed > 0 && parsed <= 150 ? parsed : null;
    }
    if (/^\d{4}$/.test(raw)) {
      const year = Number(raw);
      const date = new Date(year, 0, 1);
      return ageFromDate(date);
    }
    const dateFromString = parseDateValue(raw);
    if (dateFromString) {
      return ageFromDate(dateFromString);
    }
  }
  if (value instanceof Date) {
    return ageFromDate(value);
  }
  return null;
}

function normalizeAgeBucket(
  value: unknown,
): (typeof AGE_BUCKETS)[number] | null {
  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) {
      return null;
    }
    if (raw.endsWith("+")) {
      return "51+";
    }
    const rangeMatch = raw.match(/(\d{1,3})\s*-\s*(\d{1,3})/);
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      return ageToBucket(start);
    }
  }
  const age = parseAgeValue(value);
  if (age === null) {
    return null;
  }
  return ageToBucket(age);
}

function ageToBucket(age: number): (typeof AGE_BUCKETS)[number] | null {
  if (!Number.isFinite(age) || age <= 0) {
    return null;
  }
  if (age <= 30) {
    return "20-30";
  }
  if (age <= 40) {
    return "31-40";
  }
  if (age <= 50) {
    return "41-50";
  }
  return "51+";
}

function normalizeEducation(
  value: unknown,
): (typeof EDUCATION_LEVELS)[number] | null {
  if (value === null || value === undefined) {
    return null;
  }
  const raw = String(value).trim().toLowerCase();
  if (!raw) {
    return null;
  }
  const compact = raw.replace(/[^a-z0-9]/g, "");
  if (compact.includes("s3") || raw.includes("doktor") || raw.includes("phd")) {
    return "S3";
  }
  if (
    compact.includes("s2") ||
    raw.includes("magister") ||
    raw.includes("master")
  ) {
    return "S2";
  }
  if (
    compact.includes("s1") ||
    compact.includes("d4") ||
    /\bd\s*-?\s*iv\b/.test(raw) ||
    raw.includes("sarjana")
  ) {
    return "S1-D4";
  }
  if (
    compact.includes("d1") ||
    compact.includes("d2") ||
    compact.includes("d3") ||
    /\bd\s*-?\s*i{1,3}\b/.test(raw) ||
    raw.includes("diploma")
  ) {
    return "D1-D3";
  }
  if (
    raw.includes("slta") ||
    raw.includes("sma") ||
    raw.includes("smk") ||
    raw.includes("ma")
  ) {
    return "SLTA";
  }
  return null;
}

function normalizeLabel(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }
  const text = String(value).trim();
  return text ? text : null;
}

function normalizePositionGroup(value: unknown, eselonValue?: unknown): string {
  // 1. Trust the 'eselon' column if it exists
  if (eselonValue) {
    const eselon = String(eselonValue).trim().toUpperCase();
    if (eselon === "II" || eselon.includes("II")) return "Eselon II";
    if (eselon === "III" || eselon.includes("III")) return "Eselon III";
    if (eselon === "IV" || eselon.includes("IV")) return "Eselon IV";
  }

  if (!value) return "JFU"; // Default to JFU if missing
  const text = String(value).trim().toLowerCase();

  // 2. Strict Position Matching (only if explicit 'eselon' in title AND column was empty)
  if (text.includes("eselon ii")) return "Eselon II";
  if (text.includes("eselon iii")) return "Eselon III";
  if (text.includes("eselon iv")) return "Eselon IV";

  // 3. JFT Detection (Expanded)
  if (
    text.includes("jft") ||
    text.includes("fungsional tertentu") ||
    text.includes("ahli") ||
    text.includes("pranata") ||
    text.includes("arsiparis") ||
    text.includes("analis") ||
    text.includes("guru") ||
    text.includes("dosen") ||
    text.includes("dokter") ||
    text.includes("perawat") ||
    text.includes("bidan") ||
    text.includes("apoteker") ||
    text.includes("penyuluh") ||
    text.includes("pengawas") ||
    text.includes("auditor") ||
    text.includes("pustakawan") ||
    text.includes("widyaiswara") ||
    text.includes("statistisi") ||
    text.includes("assesor")
  ) {
    return "JFT";
  }

  // 4. Default Fallback
  return "JFU";
}

export function buildStatsFromRows(rows: RawRow[]): EmployeeStats {
  const statusCounts: StatusCounts = {
    PNS: 0,
    CPNS: 0,
    PPPK: 0,
    PPnPN: 0,
    KI: 0,
  };

  const ageMap: Record<string, AgeRow> = {};
  for (const range of AGE_BUCKETS) {
    ageMap[range] = { range, pns: 0, cpns: 0, pppk: 0, ki: 0, total: 0 };
  }

  const educationMap: Record<string, EducationRow> = {};
  for (const level of EDUCATION_LEVELS) {
    educationMap[level] = { level, pns: 0, cpns: 0, pppk: 0, ki: 0, total: 0 };
  }

  const genderAgeMap: Record<string, GenderAgeRow> = {};
  for (const range of AGE_BUCKETS) {
    genderAgeMap[range] = { age: range, male: 0, female: 0 };
  }

  const positionMap = new Map<
    string,
    { label: string; male: number; female: number }
  >();
  const departmentMap = new Map<
    string,
    { label: string; male: number; female: number }
  >();

  let maleEmployees = 0;
  let femaleEmployees = 0;

  for (const row of rows) {
    const status = normalizeStatus(
      pickField(row, FIELD_SETS.status, FIELD_OVERRIDES.status),
    );
    if (status) {
      statusCounts[status] += 1;
    }

    const gender = normalizeGender(
      pickField(row, FIELD_SETS.gender, FIELD_OVERRIDES.gender),
    );
    if (gender === "male") {
      maleEmployees += 1;
    } else if (gender === "female") {
      femaleEmployees += 1;
    }

    const ageValue = pickField(row, FIELD_SETS.age, FIELD_OVERRIDES.age);
    const ageBucket =
      normalizeAgeBucket(ageValue) ??
      normalizeAgeBucket(
        pickField(row, FIELD_SETS.birthDate, FIELD_OVERRIDES.birthDate),
      );
    if (ageBucket && gender) {
      const genderAgeRow = genderAgeMap[ageBucket];
      if (gender === "male") {
        genderAgeRow.male += 1;
      } else {
        genderAgeRow.female += 1;
      }
    }

    if (ageBucket && status) {
      const ageRow = ageMap[ageBucket];
      const field = STATUS_TO_FIELD[status];
      if (field) {
        ageRow[field] += 1;
        ageRow.total += 1;
      }
    }

    const education = normalizeEducation(
      pickField(row, FIELD_SETS.education, FIELD_OVERRIDES.education),
    );
    if (education && status) {
      const educationRow = educationMap[education];
      const field = STATUS_TO_FIELD[status];
      if (field) {
        educationRow[field] += 1;
        educationRow.total += 1;
      }
    }

    const positionLabel = pickField(
      row,
      FIELD_SETS.position,
      FIELD_OVERRIDES.position,
    );
    const eselonValue = pickField(
      row,
      FIELD_SETS.eselon,
      FIELD_OVERRIDES.eselon,
    );

    if (gender) {
      const group = normalizePositionGroup(positionLabel, eselonValue);
      const key = group.toLowerCase();

      const existing = positionMap.get(key) ?? {
        label: group,
        male: 0,
        female: 0,
      };
      if (gender === "male") {
        existing.male += 1;
      } else {
        existing.female += 1;
      }
      positionMap.set(key, existing);
    }

    const departmentLabel = normalizeLabel(
      pickField(row, FIELD_SETS.department, FIELD_OVERRIDES.department),
    );
    if (departmentLabel && gender) {
      const key = departmentLabel.toLowerCase();
      const existing = departmentMap.get(key) ?? {
        label: departmentLabel,
        male: 0,
        female: 0,
      };
      if (gender === "male") {
        existing.male += 1;
      } else {
        existing.female += 1;
      }
      departmentMap.set(key, existing);
    }
  }

  // Ensure standard positions exist in the map so they appear in chart
  const STANDARD_POSITIONS = [
    "Eselon II",
    "Eselon III",
    "Eselon IV",
    "JFT",
    "JFU",
  ];
  for (const pos of STANDARD_POSITIONS) {
    if (!positionMap.has(pos.toLowerCase())) {
      positionMap.set(pos.toLowerCase(), { label: pos, male: 0, female: 0 });
    }
  }

  const ageData = AGE_BUCKETS.map((range) => ageMap[range]);
  const educationData = EDUCATION_LEVELS.map((level) => educationMap[level]);

  const ageCategoryData = STATUS_ORDER.filter(
    (status) => status !== "PPnPN",
  ).map((status) => ({
    name: status,
    value: statusCounts[status],
    color: STATUS_COLORS[status],
  }));

  const educationChart = EDUCATION_LEVELS.map((level) => ({
    name: level,
    value: educationMap[level].total,
    color: EDUCATION_COLORS[level],
  }));

  const positionData = Array.from(positionMap.values())
    .filter((item) =>
      ["Eselon II", "Eselon III", "Eselon IV", "JFT", "JFU"].includes(
        item.label,
      ),
    )
    .sort((a, b) => {
      const order = ["Eselon II", "Eselon III", "Eselon IV", "JFT", "JFU"];
      const idxA = order.indexOf(a.label);
      const idxB = order.indexOf(b.label);
      return idxA - idxB;
    })
    .map((item) => ({
      position: item.label,
      male: item.male,
      female: item.female,
    }));

  const positionCategory = positionData.map((item, index) => ({
    name: item.position,
    value: item.male + item.female,
    color: CATEGORY_PALETTE[index % CATEGORY_PALETTE.length],
  }));

  const departmentData = Array.from(departmentMap.values())
    .sort((a, b) => a.label.localeCompare(b.label, "id"))
    .map((item) => ({
      dept: item.label,
      male: item.male,
      female: item.female,
    }));

  const departmentCategory = departmentData.map((item, index) => ({
    name: item.dept,
    value: item.male + item.female,
    color: CATEGORY_PALETTE[index % CATEGORY_PALETTE.length],
  }));

  const genderAgeData = AGE_BUCKETS.map((range) => genderAgeMap[range]);
  const genderCategory = [
    { name: "Laki-laki", value: maleEmployees, color: "#3b82f6" },
    { name: "Perempuan", value: femaleEmployees, color: "#ec4899" },
  ];

  const totalEmployees =
    rows.length > 0
      ? rows.length
      : STATUS_ORDER.reduce((sum, status) => sum + statusCounts[status], 0);

  return {
    summary: {
      totalEmployees,
      maleEmployees,
      femaleEmployees,
      statusCounts,
    },
    ageData,
    ageCategoryData,
    educationData,
    educationChart,
    positionData,
    positionCategory,
    departmentData,
    departmentCategory,
    genderAgeData,
    genderCategory,
  };
}
