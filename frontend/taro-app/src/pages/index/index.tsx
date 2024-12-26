import { View, Image } from '@tarojs/components';
import { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import request from '../../utils/request';
import './index.scss';

export default function Index() {
    const [recentRecords, setRecentRecords] = useState([]);
    const [upcomingDates, setUpcomingDates] = useState([]);

    // 加载汇总数据
    const loadSummary = async () => {
        try {
            // 获取最近记录
            const recordsRes = await request({
                url: '/api/record/recent',
                method: 'GET'
            });
            if (recordsRes.code === 0) {
                setRecentRecords(recordsRes.data);
            }

            // 获取即将到来的纪念日
            const datesRes = await request({
                url: '/api/dates/upcoming',
                method: 'GET'
            });
            if (datesRes.code === 0) {
                setUpcomingDates(datesRes.data);
            }
        } catch (error) {
            console.error('加载汇总数据失败:', error);
            Taro.showToast({
                title: '加载失败',
                icon: 'error'
            });
        }
    };

    useEffect(() => {
        loadSummary();
    }, []);

    return (
        <View className='index'>
            <View className='section'>
                <View className='section-title'>最近记录</View>
                <View className='records'>
                    {recentRecords.map((record: any) => (
                        <View key={record.id} className='record-item'>
                            <Image
                                className='record-image'
                                src={record.imageUrl}
                                mode='aspectFill'
                            />
                            <View className='record-content'>{record.content}</View>
                            <View className='record-time'>{record.createdAt}</View>
                        </View>
                    ))}
                </View>
            </View>

            <View className='section'>
                <View className='section-title'>即将到来的纪念日</View>
                <View className='dates'>
                    {upcomingDates.map((date: any) => (
                        <View key={date.id} className='date-item'>
                            <View className='date-title'>{date.title}</View>
                            <View className='date-time'>{date.date}</View>
                            <View className='days-left'>{date.daysLeft}天</View>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
} 