// // 云函数模板
// // 部署：在 cloud-functions/schedule 文件夹右击选择 “上传并部署”
// const cloud = require('wx-server-sdk')

// // 初始化 cloud
// cloud.init({
//   // API 调用都保持和云函数当前所在环境一致
//   env: cloud.DYNAMIC_CURRENT_ENV
// })
// // cloud.init({ env })
// // const db = cloud.database({ env })
// // const db = cloud.database();

// exports.main = async event => {
//   console.log(event);
//   const { action = '' } = event;

//   // if (!env) {
//   //   throw new Error('环境ID为空！')
//   // }
//   if (!action) {
//     throw new Error('请传入action标识操作！')
//   }


//   switch (event.action) {
//     case 'addSchedule': {
//       return addSchedule(event)
//     }
//     case 'sendSubscribeMessage': {
//       return sendSubscribeMessage(event)
//     }
//     default: {
//       return;
//     }
//   }

//   async function addSchedule(event) {
//     console.log(`===add schedule event`);
//     console.log(event)
//     // const { deliverDate = '', list = [], templateId = '', page = '' } = event;
//     // const wxContext = cloud.getWXContext()

//     return {
//       event,
//       openid: wxContext.OPENID,
//       appid: wxContext.APPID,
//       unionid: wxContext.UNIONID,
//       env: wxContext.ENV,
//     }

//     // const { OPENID } = cloud.getWXContext()
//     // return await db.collection(`subscribeMessage`).add({
//     //   data: {
//     //     touser: OPENID,
//     //     data: {
//     //       deliverDate,
//     //       list
//     //     },
//     //     page,
//     //     templateId,
//     //     done: false,
//     //   }
//     // })
//   }
// }

// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

import { ScheduleType, ScheduleItem } from './model'

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const templateId = 'dxH2-uMQglbYE7zRGG6IctfclXcX9tKA7xZXLu-xHTQ';

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data`
 * 
 */
exports.main = async (event, context) => {
  console.log(event)
  console.log(context)


  // const db = cloud.database();
  // console.log(1111);

  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext()

  const { ENV, APPID } = cloud.getWXContext()

  const OPENID = 'oz0Lr5eM4_uxdvBj8k5Kgc7kdtMI';

  const db = cloud.database({ env: cloud.DYNAMIC_CURRENT_ENV })

  switch (event.action) {
    case 'addSchedule': {
      return addSchedule(event)
    }
    // case 'sendSubscribeMessage': {
    //   return sendSubscribeMessage(event)
    // }
    default: {
      return;
    }
  }

  async function addSchedule(event) {
    const { sleepTimeText = '', wakeTimeText = '', note = '' } = event;

    const data: ScheduleItem = {
      touser: OPENID,
      templateId,
      sleepTimeText,
      wakeTimeText,
      note,
      status: 0,
    }

    return await db.collection(`schedule`).add(data)
  }

}


