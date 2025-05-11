export function getAstrologySign(month: number, day: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return "Aries"
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return "Taurus"
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return "Gemini"
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return "Cancer"
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return "Leo"
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return "Virgo"
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return "Libra"
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return "Scorpio"
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return "Sagittarius"
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return "Capricorn"
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return "Aquarius"
  } else {
    return "Pisces"
  }
}

export function getMoonPhase(date: Date): string {
  // A simple approximation of moon phases
  // In a real app, you would use a more accurate astronomical calculation
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  // Calculate approximate days since new moon on Jan 6, 2000
  const lp = 2551443 // Lunar period in seconds
  const now = new Date(year, month - 1, day, 20, 35, 0).getTime() / 1000
  const newMoon = new Date(2000, 0, 6, 18, 14, 0).getTime() / 1000
  const phase = ((now - newMoon) % lp) / lp

  if (phase < 0.025 || phase >= 0.975) return "New Moon"
  else if (phase < 0.25) return "Waxing Crescent"
  else if (phase < 0.275) return "First Quarter"
  else if (phase < 0.475) return "Waxing Gibbous"
  else if (phase < 0.525) return "Full Moon"
  else if (phase < 0.725) return "Waning Gibbous"
  else if (phase < 0.775) return "Last Quarter"
  else return "Waning Crescent"
}

export function getChineseZodiac(birthYear: number): string {
  const animals = [
    "Rat",
    "Ox",
    "Tiger",
    "Rabbit",
    "Dragon",
    "Snake",
    "Horse",
    "Goat",
    "Monkey",
    "Rooster",
    "Dog",
    "Pig",
  ]

  // Chinese zodiac follows a 12-year cycle
  // 1900 was the year of the Rat
  const offset = (birthYear - 1900) % 12
  return animals[offset]
}

export function getElementalAffinity(sign: string): string {
  const fireSign = ["Aries", "Leo", "Sagittarius"]
  const earthSigns = ["Taurus", "Virgo", "Capricorn"]
  const airSigns = ["Gemini", "Libra", "Aquarius"]
  const waterSigns = ["Cancer", "Scorpio", "Pisces"]

  if (fireSign.includes(sign)) return "Fire"
  if (earthSigns.includes(sign)) return "Earth"
  if (airSigns.includes(sign)) return "Air"
  if (waterSigns.includes(sign)) return "Water"

  return "Unknown"
}
