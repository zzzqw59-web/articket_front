export const getStatisticSummary = (data) => {
  if (!data || data.length === 0) {
    return {
      average: 0,
      total: 0,
      max: null,
      min: null,
    };
  }

  const values = data.map((item) => item.value);

  const total = values.reduce((sum, value) => sum + value, 0);
  const average = total / values.length;
  const max = data.reduce((max, item) => (item.value > max.value ? item : max));
  const min = data.reduce((min, item) => (item.value < min.value ? item : min));

  return {
    average,
    total,
    max,
    min,
  };
};
