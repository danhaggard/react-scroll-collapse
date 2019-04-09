import { pubsub } from '.';

export const roomOccupantListenerFactory = setChatRoom => (roomName, occupants, isPrimary) => {
  console.log('roomOccupantListenerFactory: roomName, occupants, isPrimary', roomName, occupants, isPrimary);
  setChatRoom({ isPrimary, occupants, roomName });
};
export const listenerFactory = psub => key => (...args) => psub.publish(key, [...args]);
export const peerListenerFactory = psub => listenerFactory(psub)('receive');
export const loginSuccessListenerFactory = psub => listenerFactory(psub)('loginSuccess');
export const loginFailureListenerFactory = psub => listenerFactory(psub)('loginFailure');
export const messageSenderFactory = (getChatRoom, rtc) => (text) => {
  const { occupants } = getChatRoom();
  Object.keys(occupants).forEach((key) => {
    rtc.sendDataWS(key, 'message', text);
  });
};

/* data channel listener factories */
export const openListenerFactory = psub => listenerFactory(psub)('openDataChannel');
export const closeListenerFactory = psub => listenerFactory(psub)('closeDataChannel');
export const dataPeerListenerFactory = psub => listenerFactory(psub)('receiveData');
export const dataRoomOccupantListenerFactory = psub => listenerFactory(psub)('receiveOccupantData');


const rtcApi = (rtc = window.easyrtc, psub = pubsub()) => {

  rtc.setSocketUrl(':8081');
  const state = {
    chatRoom: {},
    isConnected: false,

    /* data channel */
    id: '',
    dataChannels: {},
    connectList: {},
  };

  const setChatRoom = chatRoom => (state.chatRoom = chatRoom);
  const setIsConnected = isConnected => (state.isConnected = isConnected);
  const setId = id => (state.id = id);
  const getId = () => state.id;
  const getChatRoom = () => state.chatRoom;
  const onLoginSuccess = func => psub.subscribe('loginSuccess', func);
  onLoginSuccess((id) => {
    console.log('onLoginSuccess, id', id);
    setIsConnected(true);
    setId(id);
  });
  onLoginSuccess(args => console.log('logged in: args, state', args, state));
  const connect = () => {
    rtc.setPeerListener(peerListenerFactory(psub));
    rtc.setRoomOccupantListener(roomOccupantListenerFactory(setChatRoom));
    rtc.connect('easyrtc.instantMessaging', loginSuccessListenerFactory(psub), loginFailureListenerFactory(psub));
  };


  /* data channel */
  /*
  export const roomOccupantListenerFactory = setChatRoom => (roomName, occupants, isPrimary) => {
    console.log('roomOccupantListenerFactory: roomName, occupants, isPrimary', roomName, occupants, isPrimary);
    setChatRoom({ isPrimary, occupants, roomName });
  };
  */

  const onDataRoomOccupantWrapper = func => (roomName, occupants, isPrimary) => {
    console.log('onDataRoomOccupantWrapper: roomName, occupants, isPrimary', roomName, occupants, isPrimary);
    func({ isPrimary, occupants, roomName });
  };
  const onReceiveDataRoomOccupant = func => psub.subscribe('receiveOccupantData', func);
  const onDataRoomOccupantWrapped = onDataRoomOccupantWrapper(setChatRoom);
  onReceiveDataRoomOccupant(onDataRoomOccupantWrapped);

  const setDataChannel = (otherPartyId, dataChannelState) => {
    const { dataChannels: id } = state;
    console.log('id', id);
    // if (id !== )
  };

  const setDataChannelActive = otherPartyId => setDataChannel(otherPartyId, {
    active: true,
  });

  const setConnectList = (otherPartyId, subState) => {
    const { dataChannels: id } = state;
    console.log('id', id);
    // if (id !== )
  };

  const setConnectListActive = (otherPartyId, active) => setConnectList(otherPartyId, {
    active,
  });


  const startCall = (otherEasyrtcid) => {
    if (rtc.getConnectStatus(otherEasyrtcid) === rtc.NOT_CONNECTED) {
      try {
        rtc.call(otherEasyrtcid,
          (caller, media) => { // success callback
            if (media === 'datachannel') {
              // console.log("made call succesfully");
              setConnectListActive(otherEasyrtcid, true);
            }
          },
          (errorCode, errorText) => {
            setConnectListActive(otherEasyrtcid, false);
            rtc.showError(errorCode, errorText);
          },
          (wasAccepted) => {
            console.log(`was accepted=${wasAccepted}`);
          });
      } catch (callerror) {
        console.log('saw call error ', callerror);
      }
    } else {
      rtc.showError('ALREADY-CONNECTED', `already connected to ${rtc.idToName(otherEasyrtcid)}`);
    }
  };

  const openListener = psub.subscribe('openDataChannel', setDataChannelActive);
  const connectData = () => {
    rtc.enableDebug(false);
    rtc.enableDataChannels(true);
    rtc.enableVideo(false);
    rtc.enableAudio(false);
    rtc.enableVideoReceive(false);
    rtc.enableAudioReceive(false);
    rtc.setDataChannelOpenListener(openListenerFactory(psub));
    rtc.setDataChannelCloseListener(closeListenerFactory(psub));
    rtc.setPeerListener(dataPeerListenerFactory(psub));
    rtc.setRoomOccupantListener(dataRoomOccupantListenerFactory(psub));
    rtc.connect('easyrtc.dataMessaging', loginSuccessListenerFactory(psub), loginFailureListenerFactory(psub));
  };

  return {
    getChatRoom,
    getId,
    getIsConnected: () => state.isConnected,
    connect,
    connectData,
    disconnect: () => {
      setIsConnected(false);
      rtc.disconnect();
    },
    // onEmitEasyrtcMsg: (obj) => console.log('onEmitEasyrtcMsg, obj', obj),
    onLoginSuccess,
    onLoginFailure: func => psub.subscribe('loginFailure', func),
    onReceive: func => psub.subscribe('receive', func),
    onReceiveData: func => psub.subscribe('receiveData', func),
    onReceiveDataRoomOccupant,
    getOnReceive: token => psub.topics.receive[token],
    sendMessage: messageSenderFactory(getChatRoom, rtc),
    sendPeerMessage: rtc.sendPeerMessage,
    setUsername: name => rtc.setUsername(name),
    unSubscribe: token => psub.unsubscribe(token)
  };
};


export default rtcApi();
