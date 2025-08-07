/**
 * Форматирует год вступления в курс
 */
export function formatCourseYear(yearOfAdmission: number): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentDay = now.getDate();
  
  // Если сейчас до 5 октября, считаем как предыдущий учебный год
  const academicYear = (currentMonth < 10 || (currentMonth === 10 && currentDay < 5)) 
    ? currentYear - 1 
    : currentYear;
  
  const course = academicYear - yearOfAdmission + 1;
  
  return `${course} курс`;
}

/**
 * Извлекает год вступления из строки курса
 */
export function extractYearFromCourse(courseString: string): number {
  // Извлекаем номер курса из формата "1 курс", "2 курс" и т.д.
  const match = courseString.match(/^(\d+)\s*курс$/);
  if (match) {
    const course = parseInt(match[1]);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    
    // Определяем текущий учебный год
    const academicYear = (currentMonth < 10 || (currentMonth === 10 && currentDay < 5)) 
      ? currentYear - 1 
      : currentYear;
    
    // Вычисляем год поступления
    return academicYear - course + 1;
  }
  
  // Fallback - возвращаем текущий год
  return new Date().getFullYear();
} 