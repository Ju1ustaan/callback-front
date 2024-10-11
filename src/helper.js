export const saveLanguage = (lang) => {
    localStorage.setItem('language', lang);
};

export const getLanguage = () => {
    return localStorage.getItem('language') || 'kg';
};

export const yearsArray = (currentYear, val) => {
    const yearsArray = [];
    for (let year = currentYear - val; year <= currentYear; year++) {
        yearsArray.push(year);
    }
    return yearsArray
}