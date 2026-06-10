export const GRID_SIZE = 40;
export const MAP_WIDTH = 1200;
export const MAP_HEIGHT = 700;
export const COLS = Math.floor(MAP_WIDTH / GRID_SIZE);
export const ROWS = Math.floor(MAP_HEIGHT / GRID_SIZE);

export const PLAYER_START = { x: GRID_SIZE * 8 + GRID_SIZE / 2, y: GRID_SIZE * 6 + GRID_SIZE / 2 };

export const BASE_SPEED = 140;
export const BATTERY_DRAIN_RATE = 1.0;
export const DURABILITY_DRAIN_RATE = 0.25;
export const STAMINA_DRAIN_RATE = 0.6;
export const CHARGE_RATE = 15;
export const REPAIR_RATE = 10;
export const REST_RATE = 20;

export const WEATHER_SPEED_MODIFIERS: Record<string, number> = {
  sunny: 1.0,
  cloudy: 0.95,
  rainy: 0.75,
  heavy_rain: 0.55,
  storm: 0.35,
};

export const WEATHER_NAMES: Record<string, string> = {
  sunny: '晴天',
  cloudy: '多云',
  rainy: '小雨',
  heavy_rain: '大雨',
  storm: '暴雨',
};

export const WEATHER_COLORS: Record<string, string> = {
  sunny: '#ffcc4d',
  cloudy: '#b2bec3',
  rainy: '#4a6fa5',
  heavy_rain: '#2d3436',
  storm: '#1a1a2e',
};

export const LATE_PENALTY_RATE = 0.15;
export const EARLY_BONUS_RATE = 0.1;
export const URGENCY_BONUS_RATE = 0.08;

export const MIN_ORDER_REWARD = 30;
export const MAX_ORDER_REWARD = 150;
export const MIN_ORDER_DISTANCE = 2;
export const MAX_ORDER_DISTANCE = 15;

export const CHARGE_COST = 0.5;
export const REPAIR_COST = 1;

export const MAX_AVAILABLE_ORDERS = 5;
export const ORDER_GENERATION_INTERVAL = 15000;
export const WEATHER_CHANGE_INTERVAL = 30000;

export const STORAGE_KEY = 'city_delivery_game_save';
export const SAVE_VERSION = '1.0.0';

export const LOCATION_NAMES = [
  '幸福小区', '阳光花园', '城市广场', '中心医院', '科技大厦',
  '购物中心', '美食街', '火车站', '体育馆', '图书馆',
  '公园北门', '商业街', '写字楼A座', '公寓楼', '学校门口',
  '咖啡店', '花店', '超市', '餐厅', '银行',
];

export const BUILDING_NAMES = [
  '居民区', '商业中心', '工厂', '仓库', '办公楼',
  '酒店', '医院', '学校', '公园', '停车场',
];

export const VEHICLE_PARTS = [
  { id: 'tire-1', name: '原厂轮胎', category: 'tire' as const, tier: 1, price: 0, weight: 10, speedBonus: 0, batteryDrainModifier: 1.0, durabilityDrainModifier: 1.0, maxBatteryBonus: 0, maxDurabilityBonus: 0, description: '标配轮胎，各项性能均衡。' },
  { id: 'tire-2', name: '耐磨轮胎', category: 'tire' as const, tier: 2, price: 200, weight: 12, speedBonus: 0, batteryDrainModifier: 1.05, durabilityDrainModifier: 0.7, maxBatteryBonus: 0, maxDurabilityBonus: 0, description: '采用耐磨橡胶，耐久损耗降低30%，但略增加耗电。' },
  { id: 'tire-3', name: '低滚阻轮胎', category: 'tire' as const, tier: 3, price: 500, weight: 9, speedBonus: 10, batteryDrainModifier: 0.85, durabilityDrainModifier: 1.1, maxBatteryBonus: 0, maxDurabilityBonus: 0, description: '减少滚动阻力，速度+10，耗电降低15%，但磨损略快。' },
  { id: 'tire-4', name: '竞速轮胎', category: 'tire' as const, tier: 4, price: 1200, weight: 8, speedBonus: 25, batteryDrainModifier: 1.15, durabilityDrainModifier: 1.3, maxBatteryBonus: 0, maxDurabilityBonus: 0, description: '追求极致速度，速度+25，但耗电和磨损增加明显。' },

  { id: 'motor-1', name: '原厂电机', category: 'motor' as const, tier: 1, price: 0, weight: 15, speedBonus: 0, batteryDrainModifier: 1.0, durabilityDrainModifier: 1.0, maxBatteryBonus: 0, maxDurabilityBonus: 0, description: '标配驱动电机，性能稳定。' },
  { id: 'motor-2', name: '高效电机', category: 'motor' as const, tier: 2, price: 300, weight: 16, speedBonus: 5, batteryDrainModifier: 0.85, durabilityDrainModifier: 1.0, maxBatteryBonus: 0, maxDurabilityBonus: 0, description: '转换效率提升，耗电降低15%，速度略有提升。' },
  { id: 'motor-3', name: '高扭矩电机', category: 'motor' as const, tier: 3, price: 800, weight: 20, speedBonus: 15, batteryDrainModifier: 1.1, durabilityDrainModifier: 1.1, maxBatteryBonus: 0, maxDurabilityBonus: 0, description: '动力更强，速度+15，但耗电和磨损有所增加。' },
  { id: 'motor-4', name: '涡轮电机', category: 'motor' as const, tier: 4, price: 2000, weight: 18, speedBonus: 35, batteryDrainModifier: 1.25, durabilityDrainModifier: 1.2, maxBatteryBonus: 0, maxDurabilityBonus: 0, description: '顶级动力，速度+35，但耗电和磨损显著增加。' },

  { id: 'battery-1', name: '原厂电池', category: 'battery' as const, tier: 1, price: 0, weight: 20, speedBonus: 0, batteryDrainModifier: 1.0, durabilityDrainModifier: 1.0, maxBatteryBonus: 0, maxDurabilityBonus: 0, description: '标准锂电池，容量100Ah。' },
  { id: 'battery-2', name: '增强电池', category: 'battery' as const, tier: 2, price: 400, weight: 25, speedBonus: -5, batteryDrainModifier: 1.0, durabilityDrainModifier: 1.0, maxBatteryBonus: 50, maxDurabilityBonus: 0, description: '容量提升至150Ah，续航更长，但重量增加略有减速。' },
  { id: 'battery-3', name: '轻量电池', category: 'battery' as const, tier: 3, price: 1000, weight: 15, speedBonus: 8, batteryDrainModifier: 0.9, durabilityDrainModifier: 1.0, maxBatteryBonus: 30, maxDurabilityBonus: 0, description: '轻量化设计，容量130Ah，重量减轻，速度+8，耗电降低。' },
  { id: 'battery-4', name: '石墨烯电池', category: 'battery' as const, tier: 4, price: 2500, weight: 18, speedBonus: 5, batteryDrainModifier: 0.75, durabilityDrainModifier: 0.9, maxBatteryBonus: 100, maxDurabilityBonus: 0, description: '尖端科技，容量200Ah，耗电降低25%，各项性能优秀。' },

  { id: 'frame-1', name: '原厂车架', category: 'frame' as const, tier: 1, price: 0, weight: 25, speedBonus: 0, batteryDrainModifier: 1.0, durabilityDrainModifier: 1.0, maxBatteryBonus: 0, maxDurabilityBonus: 0, description: '标准钢制车架，坚固耐用。' },
  { id: 'frame-2', name: '加固车架', category: 'frame' as const, tier: 2, price: 250, weight: 30, speedBonus: -3, batteryDrainModifier: 1.05, durabilityDrainModifier: 0.75, maxBatteryBonus: 0, maxDurabilityBonus: 30, description: '结构加固，最大耐久+30，损耗降低25%，但略重。' },
  { id: 'frame-3', name: '铝合金车架', category: 'frame' as const, tier: 3, price: 700, weight: 18, speedBonus: 12, batteryDrainModifier: 0.95, durabilityDrainModifier: 1.0, maxBatteryBonus: 0, maxDurabilityBonus: 10, description: '轻量化铝合金，速度+12，耐久+10，各方面均衡提升。' },
  { id: 'frame-4', name: '碳纤维车架', category: 'frame' as const, tier: 4, price: 1800, weight: 12, speedBonus: 20, batteryDrainModifier: 0.85, durabilityDrainModifier: 0.85, maxBatteryBonus: 0, maxDurabilityBonus: 50, description: '顶级碳纤维，速度+20，耐久+50，耗电和损耗均降低。' },
];

export const PART_CATEGORY_NAMES: Record<string, string> = {
  tire: '轮胎',
  motor: '电机',
  battery: '电池',
  frame: '车架',
};

export const PART_CATEGORY_ICONS: Record<string, string> = {
  tire: '🛞',
  motor: '⚙️',
  battery: '🔋',
  frame: '🛠️',
};
