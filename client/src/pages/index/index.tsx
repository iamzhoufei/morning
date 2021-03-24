import { useState } from 'react'
import { useMount } from 'react-use'
import moment from 'moment';
import Taro from '@tarojs/taro'
import { View, Picker, Button } from '@tarojs/components'
import { AtButton, AtMessage, AtInput } from 'taro-ui'

import { addSchedule } from '../../services/schedule';
import './index.scss'

// import FireWorks from '../../components/fireworks'

const Index = () => {

  const [auth, updateAuth] = useState<boolean>(false);

  const [userInfo, updateUserInfo] = useState<any>();

  const [sleepTime, updateSleepTime] = useState<string>('');
  const [sleepTimeText, updateSleepTimeText] = useState<string>('');

  const [wakeTime, updateWakeTime] = useState<string>('');
  const [wakeTimeText, updateWakeTimeText] = useState<string>('');

  const [note, updateNote] = useState<string>('');

  const [fireWorksVisible, updateFireWorksVisible] = useState<boolean>(false);

  const handleLogin = async (ev) => {
    console.log(ev)
    // const { userInfo = {} } = ev.detail;

    try {
      const loginResult = await Taro.login();
      console.log(loginResult)
    } catch (error) {
      console.log(error)
    }

    // try {
    //   const settingResult = await Taro.getSetting();
    //   console.log(settingResult);

    //   if (settingResult.authSetting['scope.userInfo']) {
    //     try {
    //       const authResult = await Taro.authorize({ scope: 'scope.userInfo', });
    //       console.log(authResult)
    //     } catch (error) {
    //       console.log(error)
    //     }
    //   }

    // } catch (error) {
    //   console.log(error)
    // }

    // try {
    //   const userInfoResult = await Taro.getUserInfo();  // { desc: '' }
    //   console.log(userInfoResult)
    // } catch (error) {
    //   console.log(error)
    // }

    // Taro.login({
    //   success(res) {
    //     console.log(res);
    //     const { code: CODE = '' } = res;

    //     Taro.getUserProfile({
    //       desc: '',
    //     })
    //   },
    //   fail(error) {
    //     console.log(error)
    //   }
    // });
  }

  const handleGetUserInfo = (event) => {
    console.log(event?.detail);
    const { userInfo } = event?.detail;
    updateAuth(true);
    updateUserInfo(userInfo);
  }

  const handleAutoGetUserInfo = async () => {
    try {
      const result = await Taro.getUserInfo();
      const { userInfo = {} } = result; // 这里获取到的userInfo是微信返回的，没有USER_TYPE
      updateAuth(true);
      updateUserInfo(userInfo);
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddSchedule = async () => {
    if (!sleepTimeText || !wakeTimeText) {
      Taro.atMessage({
        message: '请选择完整的时间',
        type: 'warning',
      })
      return;
    }

    const data = {
      sleepTimeText,
      wakeTimeText,
      note,
    };

    try {
      const result = await addSchedule(data);

      console.log(result);
    } catch (error) {
      console.log(error)
    }
  }

  const handleReset = () => {
    updateSleepTime('');
    updateWakeTime('');
  }

  const handleUpdateSleepTime = (hours: string, minutes: string) => {
    const sleepTimeText = moment().hours(+hours).minutes(+minutes).format('YYYY-MM-DD HH:mm');

    // 已存在唤醒时间，才会进行比较，否则直接设置入睡时间，没有限制
    if (wakeTime && wakeTimeText) {
      const wakeHour = wakeTime?.split(':')[0];
      const wakeMinute = wakeTime?.split(':')[1];

      if (moment(sleepTimeText)?.isBefore(wakeTimeText, 'minute')) {
        const modifiedWakeTime = moment()?.hours(+wakeHour).minutes(+wakeMinute);
        updateWakeTimeText(modifiedWakeTime.format('YYYY-MM-DD HH:mm'));
      } else {
        const modifiedWakeTime = moment()?.add(1, 'day').hours(+wakeHour).minutes(+wakeMinute);
        updateWakeTimeText(modifiedWakeTime.format('YYYY-MM-DD HH:mm'));
      }
    }

    updateSleepTime(`${hours}:${minutes}`);
    updateSleepTimeText(sleepTimeText);
  }

  const handleUpdateWakeTime = (hours: string, minutes: string) => {

    const wakeTimeText = moment().hours(+hours).minutes(+minutes).format('YYYY-MM-DD HH:mm');

    if (sleepTime && sleepTimeText) {
      if (!moment(sleepTimeText)?.isBefore(wakeTimeText, 'minute')) {
        const modifiedWakeTime = moment()?.add(1, 'day').hours(+hours).minutes(+minutes);
        updateWakeTimeText(modifiedWakeTime.format('YYYY-MM-DD HH:mm'));
        return;
      }
    }
    updateWakeTime(`${hours}:${minutes}`)

    updateWakeTimeText(wakeTimeText);
  }

  useMount(() => {
    handleAutoGetUserInfo()
    // Taro.getSetting({
    //   success(res) {
    //     console.log(res);
    //     if (!res.authSetting['scope.userInfo']) {
    //       Taro.authorize({
    //         scope: 'scope.userInfo',
    //       }).then(res => {
    //         console.log(res)
    //         handleAutoGetUserInfo()
    //       }).catch(err => {
    //         console.log('====拒绝授权')
    //         console.log(err)  // 没有获得授权
    //       })
    //     } else {
    //       handleAutoGetUserInfo()
    //     }
    //   }
    // })
  })

  return <View className='index_wrapper'>
    <View className='index_info'>
      <View className='index_info_item'>
        <Picker mode='time' onChange={(ev) => {
          const sleepHour = ev?.detail?.value?.split(':')[0];
          const sleepMinute = ev?.detail?.value?.split(':')[1];
          handleUpdateSleepTime(sleepHour, sleepMinute)
        }} value={sleepTime}>
          {
            sleepTimeText || '入睡时间'
          }
        </Picker>
      </View>

      <View className='index_info_gap'>
        /
    </View>

      <View className='index_info_item'>
        <Picker mode='time' onChange={(ev) => {
          const wakeHour = ev?.detail?.value?.split(':')[0];
          const wakeMinute = ev?.detail?.value?.split(':')[1];
          handleUpdateWakeTime(wakeHour, wakeMinute)
        }} value={wakeTime}>
          {
            wakeTimeText || '叫醒时间'
          }
        </Picker>
      </View>

      <View className='index_info_item'>
        <AtInput
          name='value'
          title=''
          type='text'
          placeholder='兔子还有别的要对熊说吗？'
          value={note}
          onChange={(value) => { console.log(value) }}
        />
      </View>
    </View>

    {
      auth ? <>
        <AtButton className='btn' type='primary' onClick={handleAddSchedule}>让熊知道</AtButton>
        <AtButton className='btn' type='secondary' onClick={handleReset}>兔再想想</AtButton>
      </> : <Button className='btn login' open-type="getUserInfo" onGetUserInfo={handleGetUserInfo} >获取用户信息</Button>
    }

    {/* <Button className='btn login' open-type="getUserInfo" onGetUserInfo={handleGetUserInfo} >获取用户信息</Button> */}

    {/* <AtButton className='btn login' onClick={handleLogin} >使用微信登录</AtButton> */}

    {/* <button className='btn login' open-type="getUserInfo" bindgetuserinfo={(event) => console.log(event)}>获取微信授权</button> */}


    {/* <AtButton className='btn danger' type='secondary' onClick={() => updateFireWorksVisible(true)}>毁灭吧世界！！</AtButton> */}

    <AtMessage />
    {/* <FireWorks visible={fireWorksVisible} updateVisible={updateFireWorksVisible} /> */}
  </View>
}

export default Index;
