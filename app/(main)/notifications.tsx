import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/screenWrapper'
import { fetchPostNotifications } from '@/services/postService'
import { useAuth } from '@/contexts/AuthContext'

const Notifications = () => {

  const [notifications, setNotfications] = useState([])
  const {user} = useAuth();
  useEffect(() => {
    getNotificatiosn();
  },[])

  const getNotificatiosn = async () => {
    let res = await fetchPostNotifications(user?.id);
    console.log("res", res);
  }
  return (
    <ScreenWrapper bg="white">
      <Text>Notifications</Text>
    </ScreenWrapper>
  )
}

export default Notifications

const styles = StyleSheet.create({})