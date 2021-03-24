import Taro from '@tarojs/taro'

const { cloud } = Taro;

// 添加通知记录
export const addSchedule = (params) => {
  const data = {
    ...params,
    action: 'addSchedule'
  }
  cloud.callFunction({ name: 'schedule', data })
}
