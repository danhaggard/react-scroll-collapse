import { useEffect, useState } from 'react';

export const useConnectEffect = (rtc) => {
  useEffect(() => {
    const isConnected = rtc.getIsConnected();
    if (!isConnected) {
      // rtc.connect();
      rtc.connectData();
    }
    return () => {
      // rtc.disconnect();
    };
  }, [rtc]);
};

export const useReceiveEffect = (rtc, onReceive) => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const isConnected = rtc.getIsConnected();
    onReceive.updateHook(setMessages);
    if (!isConnected) {
      const token = rtc.onReceive(onReceive.onReceive);
      onReceive.setToken(token);
    }
    return () => {
      rtc.unSubscribe(onReceive.getToken());
    };
  }, [rtc, onReceive]);

  return [messages, setMessages];
};

export const useReceiveOccupantDataEffect = (rtc, onReceive) => {
  const [state, setState] = useState({});
  useEffect(() => {
    const isConnected = rtc.getIsConnected();
    console.log('useReceiveOccupantDataEffect isConnected: ', isConnected);
    onReceive.updateHook(setState);
    if (!isConnected) {
      const token = rtc.onReceiveDataRoomOccupant(onReceive.onReceive);
      onReceive.setToken(token);
    }
    return () => {
      rtc.unSubscribe(onReceive.getToken());
    };
  }, [rtc, onReceive]);

  return [state, setState];
};

export const useReceivePeerData = (rtc, onReceive, state, setState) => {
  //  const [state, setState] = useState({});
  useEffect(() => {
    const isConnected = rtc.getIsConnected();
    onReceive.updateHook(setState);
    if (!isConnected) {
      const token = rtc.onReceiveData(onReceive.onReceive);
      onReceive.setToken(token);
    }
    return () => {
      rtc.unSubscribe(onReceive.getToken());
    };
  }, [rtc, onReceive, setState]);

  return [state, setState];
};
