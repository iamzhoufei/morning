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

// import { ScheduleType, ScheduleItem } from './model'

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const templateId = 'dxH2-uMQglbYE7zRGG6IcikgNETtRd-S3oCE83wWLVA';

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
    case 'getSchedule': {
      return getSchedule(event)
    }
    case 'sendSchedule': {
      return sendSchedule(event)
    }
    default: {
      return;
    }
  }

  async function addSchedule(event) {
    const { sleepTimeText = '', wakeTimeText = '', note = '' } = event;
    console.log(event);
    const data = {
      touser: OPENID,
      templateId,
      sleepTimeText,
      wakeTimeText,
      note,
      status: 0,
    }

    return await db.collection(`schedule`).add({ data })
  }

  async function getSchedule(event) {
    // const { OPENID } = cloud.getWXContext()
    return await db
      .collection('schedule')
      // 查询条件这里做了简化，只查找了状态为未发送的消息
      .where({
        status: 0,
        touser: OPENID,
      })
      .get();
  }


  async function sendSchedule(event) {
    // const { OPENID } = cloud.getWXContext()
    const { schedule = {} } = event;
    // 循环消息列表
    try {
      // 发送订阅消息
      const result = await cloud.openapi.subscribeMessage.send({
        touser: schedule.touser,
        // page: message.page,
        data: {
          time1: {
            value: schedule.sleepTimeText,
          },
          time2: {
            value: schedule.wakeTimeText,
          },
          thing3: {
            value: schedule.note,  // 存在长度限制，20个字符
          },
        },
        templateId: message.templateId,
        miniprogramState: 'developer',
        success: res => {
          console.log("云函数调用结果result", result)
        },
      });

      // 发送成功后将消息的状态改为已发送
      // db
      //   .collection('schedule')
      //   .doc(message._id)
      //   .update({
      //     data: {
      //       status: 1,
      //     },
      //   });

      return result;
    } catch (error) {
      console.log('云函数调用失败', error)
      return error
    }

    const sendPromises = schedules.map(async (schedule) => {
      // let msgContent = message.data.list.map(item => ({ name: item.name }));
      // let finalText = '';

      // for (let i = 0; i < msgContent.length; i++) {
      //   finalText += `${msgContent[i].name},`;
      //   if (finalText.length > 7) break;
      // }
      // debugger;
      // finalText = finalText.substring(0, finalText.length - 1)
      // finalText = finalText.length === 7 ? finalText += `等菜品` : finalText
      // msgContent = msgContent.length > 20 ? `${msgContent.substring(0, 17)}...` : msgContent

      console.log(schedule)

    });

    // client.request('SendSms', params, requestOption).then((result) => {
    //   console.log(JSON.stringify(result));
    // }, (ex) => {
    //   console.log(ex);
    // })

    return Promise.all(sendPromises);
  }

}


