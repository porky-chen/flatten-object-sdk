class ObjectManipulator {
  constructor() {}

  // 1. 对象多维转一维
  flatten (obj, parentKey = '', result = {}) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 构建新的键名，如果有父键，拼接当前键名
        const newKey = Array.isArray(obj) ? `${parentKey}[${key}]` : parentKey ? `${parentKey}.${key}` : key;

        const value = obj[key];
        if (typeof value === 'object' && value !== null && !(value instanceof Symbol)) {
          this.flatten(value, newKey, result);
        } else {
          result[newKey] = value;
        }
      }
    }

    return result;
  }

  // 2. 对象一维转多维
  unflatten(obj) {
    const result = {};
    const continueSymbol = /\[|\]|\./;
    const isArray = '[';

    // 获取值类型（对象或数组）
    const getVal = (str) => str === isArray ? [] : {};

    for (const path in obj) {
        // 解析路径，过滤掉 ']'，获得层级路径数组
        const keys = path.split(/(\[|\]|\.)/).filter(k => (k && k !== ']'));
        let i = 0;
        let current = result;

        while (i < keys.length) {
            const key = keys[i - 1] === isArray ? Number(keys[i]) : keys[i];
            
            // 跳过符号
            if (continueSymbol.test(key)) {
                i++;
            } else {
                const isLast = i === keys.length - 1;

                // 如果是最后一层，直接赋值
                if (isLast) {
                    current[key] = obj[path];
                } else {
                    // 如果当前层为空，则初始化对象或数组
                    if (!current[key]) current[key] = getVal(keys[i + 1]);
                }
                i++;
                current = current[key]; // 更新 current 指向下一层级
            }
        }
    }

    return result;
}

  // 3. 判断属性是否存在于对象内
  hasProperty (obj, propertyPath) {
    const keys = propertyPath.replace(/\[(\d+)\]/g, '.$1').split('.');
    return keys.reduce((acc, key) => {
      if (acc && acc.hasOwnProperty(key)) return acc[key];
      return undefined;
    }, obj) !== undefined;
  }

  // 4. 删除某个属性
  deleteProperty (obj, propertyPath) {
    const keys = propertyPath.replace(/\[(\d+)\]/g, '.$1').split('.');
    const lastKey = keys.pop();
    const parent = keys.reduce((acc, key) => (acc && acc[key] ? acc[key] : null), obj);

    if (parent && parent.hasOwnProperty(lastKey)) {
      delete parent[lastKey];
      return true
    }
    return false
  }

  // 5. 插入某个属性
  insertProperty (obj, propertyPath, value) {
    const keys = propertyPath.replace(/\[(\d+)\]/g, '.$1').split('.');
    const lastKey = keys.pop();
    const parent = keys.reduce((acc, key) => (acc[key] = acc[key] || (isNaN(Number(key)) ? [] : {})), obj);
    parent[lastKey] = value;
    return obj;
  }
}

module.exports = ObjectManipulator;