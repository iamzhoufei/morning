// 消息状态
export enum ScheduleType {
    '未发送',
    '发送成功',
    '发送失败'
}

// 消息
export interface ScheduleItem {
    touser: string;
    templateId: string;
    sleepTimeText: string;
    wakeTimeText: string;
    note?: string;
    status: ScheduleType,
}