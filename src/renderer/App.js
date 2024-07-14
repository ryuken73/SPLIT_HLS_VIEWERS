import './App.css';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import styled from 'styled-components';
import ConfigDialog from './ConfigDialog';
import GridVideos from './GridVideos';
import useLocalStorage from './hooks/useLocalStorage';
import MessagePanel from './MessagePanel';
import VideoStates from './Components/VideoStates';
import {
  getRealIndex,
  getNonPausedPlayerIndex
} from './lib/sourceUtil';
import { replace } from './lib/arrayUtil';
import "swiper/css";
import MP4Player from './MP4Player';

const KEY_OPTIONS = 'hlsCCTVOptions';
const KEY_SELECT_SAVED = 'selectedSavedCCTVs';
const KEY_NOT_SELECT_SAVED = 'notSelectedSavedCCTVs';
const INITIAL_LOAD_TIME = (new Array(9)).fill(Date.now());

const Container = styled.div`
  background-color: #282c34;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const TopPanel = styled.div`
  min-height: 100px;
  width: 100%;
  background: black;
  border: 1px solid white;
  box-sizing: border-box;
  z-index: 10;
  color: white;
`
const MiddlePanel = styled.div`
  height: 100%;
  position: relative;
  border-left: 1px solid white;
  border-right: 1px solid white;
`
const CenterArea = styled.div`
  position: absolute;
  top: 50%;
  /* left: 50%; */
  right: 5%;
  transform: translate(5%, -50%);
  border: 5px solid white;
  box-sizing: border-box;
`
const BottomPanel = styled.div`
  margin-top: auto;
  min-height: 20px;
  margin-bottom: 4px;
  color: white;
  z-index: 10;
  background: black;
`

function App() {
  const [savedOptions, saveOptions] = useLocalStorage(KEY_OPTIONS,{});
  const [selectedSaved, saveSelectedCCTVs] = useLocalStorage(KEY_SELECT_SAVED,[]);
  const [notSelectedSaved, saveNotSelectedCCTVs] = useLocalStorage(KEY_NOT_SELECT_SAVED,[]);
  const INITIAL_GRID_DIMENSION = savedOptions.gridDimension === undefined ? 2 : savedOptions.gridDimension;
  const INITIAL_AUTO_INTERVAL = savedOptions.autoInterval === undefined ? 10 : savedOptions.autoInterval;
  const INITIAL_REFRESH_MODE = savedOptions.refreshMode === undefined ? 'auto' : savedOptions.refreshMode;
  const INITIAL_REFRESH_INTERVAL = savedOptions.refreshInterval === undefined ? 1 : savedOptions.refreshInterval

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(true);
  const [modalPlayers, setModalPlayers] = React.useState([null, null])
  const [gridDimension, setGridDimension] = React.useState(INITIAL_GRID_DIMENSION);
  const [autoPlay, setAutoPlay] = React.useState(false);
  const [autoInterval, setAutoInterval] = React.useState(INITIAL_AUTO_INTERVAL);
  const [cctvsNotSelectedArray, setCCTVsNotSelectedArray] = React.useState(notSelectedSaved);
  const [cctvsSelectedArray, setCCTVsSelectedAray] = React.useState(selectedSaved);
  const [enableOverlayModal, setEnableOverlayModal] = React.useState(false);
  const [overlayContentModal, setOverContentlayModal] = React.useState(['','']);
  const [enableOverlayGlobal, setEnableOverlayGlobal] = React.useState(true);
  const [checkedCCTVId, setCheckedCCTVId] = React.useState('');
  const [currentCCTVIndex, setCurrentCCTVIndex] = React.useState(null);
  const [cctvLastLoadedTime, setLastLoadedTime] = React.useState(INITIAL_LOAD_TIME);
  const [refreshMode, setRefreshMode] = React.useState(INITIAL_REFRESH_MODE);
  const [refreshInterval, setRefreshInterval] = React.useState(INITIAL_REFRESH_INTERVAL);
  // const [swiper, setSwiper] = React.useState(null);
  const modalPlayerNumRef = React.useRef(0);
  const mediaStreamRef = React.useRef(null);

  useHotkeys('c', () => setDialogOpen(true));
  const cctvIndexRef = React.useRef(0);
  const preLoadMapRef = React.useRef(new Map());
  const setLeftSmallPlayerRef = React.useRef(()=>{});
  const autoplayTimer = React.useRef(null);
  const modalOpenRef = React.useRef(modalOpen);
  const gridNumNormalized = getRealIndex(currentCCTVIndex, gridDimension, cctvsSelectedArray)
  const cctvPlayersRef = React.useRef([]);
  const swiperRef = React.useRef(null);

  // console.log('gridNumNormalized=', gridNumNormalized, currentCCTVIndex, cctvIndexRef.current)

  const getNextPlayer = React.useCallback(() => {
    const modalOpen = modalOpenRef.current;
    let nextNum;
    if(!modalOpen){
      nextNum = 0;
    } else {
      nextNum = (modalPlayerNumRef.current + 1) % 2;
    }
    // console.log('!!! nextNum for player =', nextNum);
    modalPlayerNumRef.current=nextNum;
    return modalPlayers[nextNum]
  }, [modalPlayers])

  // const initModalPlayersIndex = React.useCallback((cctvIndex, player, modalIndex) => {
  //   // console.log('^^^^', cctvIndex, player, modalIndex)
  //   setModalPlayers(players => {
  //     const newPlayers = [...players];
  //     newPlayers[modalIndex] = player;
  //     // console.log('!!!', newPlayers)
  //     return newPlayers
  //   })
  // }, []);

  const getSourceElement = React.useCallback((cctvIndex) => {
    // const realIndex = getRealIndex(cctvIndex, gridDimension, cctvsSelectedArray)
    // console.log(cctvIndex)
    const cctv = cctvsSelectedArray[cctvIndex];
    const cctvId = cctv.cctvId;
    const preloadMap = preLoadMapRef.current;
    const preloadElement = preloadMap.get(cctvId.toString());
    return [cctv, preloadElement];
  }, [cctvsSelectedArray])

  const gridNum2CCTVIndex = React.useCallback((gridNum) => {
      return getRealIndex(gridNum, gridDimension, cctvsSelectedArray);
    },
    [cctvsSelectedArray, gridDimension],
  );

  const maximizeGrid = React.useCallback((cctvIndex) => {
    // console.log('1s. start maximizeGrid')

    const [cctv, preloadElement] = getSourceElement(cctvIndex);
    // const modalPlayer = getNextPlayer();

    // console.log('!!!', modalOpenRef.current, preloadElement, modalPlayer);
    // console.log('2s. start mirrorModalPlayer')
    // const ret = mirrorModalPlayer(preloadElement, modalPlayer);

    // const ret = mirrorModalPlayerMP4(preloadElement, modalPlayer, mediaStreamRef);

    // console.log('2e. start-end mirrorModalPlayer ret=', ret);
    // if(!ret) return false;
    setEnableOverlayModal(enableOverlayGlobal);
    setOverContentlayModal(overlayContents => {
      const newOverlayContents = [...overlayContents];
      newOverlayContents[modalPlayerNumRef.current] = cctv.title;
      return newOverlayContents
    })
    setCurrentCCTVIndex(cctvIndex)
    // setModalOpen(true);
    // modalOpenRef.current = true;
    cctvIndexRef.current = cctvIndex;
    // console.log('1e. start-end maximizeGrid')
    return true;
  },[getSourceElement, getNextPlayer, enableOverlayGlobal])

  const safeSlide = React.useCallback((targetIndex) => {
    const {gridNum, cctvIndex} = targetIndex;
    const targetCCTVIndex = cctvIndex === undefined ? gridNum2CCTVIndex(gridNum) : cctvIndex;
    const modalOpen = modalOpenRef.current;
    if(swiperRef.current === null){
      return;
    }
    if(swiperRef.current.animating){
      return;
    }
    const ret = maximizeGrid(targetCCTVIndex);
    console.log(ret)
    if(!ret) return false;
    if(modalOpen){
      // console.log('start slide next!')
      // setTimeout(() => {
        swiperRef.current.slideNext();
        // swiperRef.current.slideToLoop(targetCCTVIndex);
        // swiperRef.current.slideTo(targetCCTVIndex);
      // },200)
    } else {
      // console.log('start slide to 0')
      // swiper.slideTo(0);
      swiperRef.current.slideToLoop(0);
      setModalOpen(true);
      modalOpenRef.current = true;
    }
    // console.log('!!!!current modalOpen = ', modalOpen, swiperRef.current.activeIndex, swiperRef.current.realIndex)
    return true;
    },
    [gridNum2CCTVIndex, maximizeGrid, swiperRef],
  );

  // useAutoPlay({autoPlay, autoInterval, maximizeGrid, cctvIndexRef});
  const saveLastIndex = React.useCallback((index) => {
    cctvIndexRef.current = index;
  }, []);

  const moveToSlide = React.useCallback((index) => {
      swiperRef.current.slideTo(index);
      saveLastIndex(index);
      setCurrentCCTVIndex(index);
    },
    [saveLastIndex],
  );

  const handlePressKeyboard = React.useCallback((_, handler) => {
      const pressed = parseInt(handler.keys[0], 10);
      const targetIndex = gridNum2CCTVIndex(pressed - 1);
      moveToSlide(targetIndex);
    },
    [gridNum2CCTVIndex, moveToSlide],
  );
  useHotkeys('1', handlePressKeyboard);
  useHotkeys('2', handlePressKeyboard);
  useHotkeys('3', handlePressKeyboard);
  useHotkeys('4', handlePressKeyboard);
  useHotkeys('5', handlePressKeyboard);
  useHotkeys('6', handlePressKeyboard);
  useHotkeys('7', handlePressKeyboard);
  useHotkeys('8', handlePressKeyboard);
  useHotkeys('9', handlePressKeyboard);

  const reloadPlayerComponent = React.useCallback((cctvIndex) => {
    // console.log('getNon: reload Player:', cctvIndex)
    setLastLoadedTime(lastLoadedTime => {
      const now = Date.now();
      return replace(lastLoadedTime).index(cctvIndex).value(now);
    })
  }, [setLastLoadedTime])

  const runAutoPlay = React.useCallback(
    // eslint-disable-next-line default-param-last, @typescript-eslint/no-shadow
    (startAutoPlay = false, autoInterval) => {
      if (startAutoPlay) {
        document.title = `CCTV[auto - every ${autoInterval}s]`;
        const firstIndex = cctvIndexRef.current;
        moveToSlide(firstIndex);
        autoplayTimer.current = setInterval(() => {
          const nextPlayerIndex = (cctvIndexRef.current + 1) % (cctvPlayersRef.current.length);
          const nextIndex = getNonPausedPlayerIndex(nextPlayerIndex, cctvPlayersRef, reloadPlayerComponent);
          // console.log('!!! nextIndex=', nextIndex, cctvPlayersRef.current[nextIndex].paused())
          const ret = safeSlide({gridNum: nextIndex});
          // maximizeGrid(nextIndex);
          // swiper.slideNext();
        },autoInterval*1000)
    } else {
      document.title="CCTV"
      clearInterval(autoplayTimer.current);
    }
    return () => {
      clearInterval(autoplayTimer.current);
    }
  }, [safeSlide, reloadPlayerComponent, cctvIndexRef])

  const toggleAutoPlay = React.useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    setAutoPlay((autoPlay) => {
      if (autoPlay) {
        runAutoPlay(false);
      } else {
        runAutoPlay(true, autoInterval);
      }
      return !autoPlay;
    })
  }, [autoInterval, runAutoPlay]);

  const toggleOverlayGlobal = React.useCallback(() => {
    if(modalOpen) {
      return;
    }
    setEnableOverlayGlobal(global => {
      return !global;
    })
  },[modalOpen, setEnableOverlayGlobal])

  const setCCTVsSelectedArrayNSave = React.useCallback((cctvsArray) =>{
    setCCTVsSelectedAray(cctvsArray);
    saveSelectedCCTVs(cctvsArray);
  },[saveSelectedCCTVs])

  const setCCTVsNotSelectedArrayNSave = React.useCallback((cctvsArray) => {
    setCCTVsNotSelectedArray(cctvsArray);
    saveNotSelectedCCTVs(cctvsArray);
  },[saveNotSelectedCCTVs])

  const setOptionsNSave = React.useCallback((key, value) => {
    key === 'gridDimension' && setGridDimension(value);
    key === 'autoInterval' && setAutoInterval(value);
    key === 'refreshMode' && setRefreshMode(value);
    key === 'refreshInterval' && setRefreshInterval(value);
    const options = {
      ...savedOptions,
      [key]: value
    }
    saveOptions(options)
  },[saveOptions, savedOptions])

  return (
    <Container>
      <TopPanel>
        <VideoStates
          cctvSelected={cctvsSelectedArray}
          currentCCTVIndex={currentCCTVIndex}
        />
      </TopPanel>
      <MiddlePanel>
        <CenterArea>
          {cctvsSelectedArray.length === 0 ? (
            <div>use keyboard "c" to config HLS player to show.</div>
          ) : (
            <GridVideos
              modalOpen={modalOpen}
              modalOpenRef={modalOpenRef}
              setModalOpen={setModalOpen}
              swiperRef={swiperRef}
              setPlayer={setLeftSmallPlayerRef.current}
              cctvsSelected={cctvsSelectedArray}
              preLoadMapRef={preLoadMapRef}
              toggleAutoPlay={toggleAutoPlay}
              autoPlay={autoPlay}
              gridDimension={gridDimension}
              enableOverlayGlobal={enableOverlayGlobal}
              toggleOverlayGlobal={toggleOverlayGlobal}
              currentActiveIndex={gridNumNormalized}
              cctvPlayersRef={cctvPlayersRef}
              cctvLastLoadedTime={cctvLastLoadedTime}
              setLastLoadedTime={setLastLoadedTime}
              refreshMode={refreshMode}
              refreshInterval={refreshInterval}
              reloadPlayerComponent={reloadPlayerComponent}
              currentCCTVIndex={currentCCTVIndex}
            />
          )}
          <ConfigDialog
            open={dialogOpen}
            // cctvs={cctvs}
            cctvsNotSelected={cctvsNotSelectedArray}
            cctvsSelected={cctvsSelectedArray}
            setCCTVsSelectedAray={setCCTVsSelectedArrayNSave}
            setCCTVsNotSelectedArray={setCCTVsNotSelectedArrayNSave}
            setOptionsNSave={setOptionsNSave}
            gridDimension={gridDimension}
            autoInterval={autoInterval}
            setDialogOpen={setDialogOpen}
            checkedCCTVId={checkedCCTVId}
            setCheckedCCTVId={setCheckedCCTVId}
            setRefreshMode={setRefreshMode}
            refreshMode={refreshMode}
            setRefreshInterval={setRefreshInterval}
            refreshInterval={refreshInterval}
           />
          </CenterArea>
        </MiddlePanel>
        <BottomPanel>
          <MessagePanel />
        </BottomPanel>
    </Container>
  );
}

export default App;
