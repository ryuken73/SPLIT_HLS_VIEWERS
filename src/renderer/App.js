import './App.css';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import styled from 'styled-components';
import ConfigDialog from './ConfigDialog';
import GridVideos from './GridVideos';
import useLocalStorage from './hooks/useLocalStorage';
import MessagePanel from './MessagePanel';
import VideoStates from './Components/VideoStates';
import { getRealIndex, isPlayerPlaying } from './lib/sourceUtil';
import { replace } from './lib/arrayUtil';
import colors from './lib/colors';
import 'swiper/css';

const KEY_OPTIONS = 'hlsCCTVOptions';
const KEY_SELECT_SAVED = 'selectedSavedCCTVs';
const KEY_NOT_SELECT_SAVED = 'notSelectedSavedCCTVs';
const INITIAL_LOAD_TIME = new Array(9).fill(Date.now());

const ACTIVE_COLOR_KEY = 950;
const IDLE_COLOR_KEY = 400;

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${(props) =>
    props.autoPlay
      ? colors.active[ACTIVE_COLOR_KEY]
      : colors.idle[ACTIVE_COLOR_KEY]};
`;
const TopPanel = styled.div`
  min-height: 100px;
  width: 100%;
  border: 3px solid;
  border-color: ${(props) => props.autoPlay ? colors.active[IDLE_COLOR_KEY] : colors.idle[IDLE_COLOR_KEY]};
  box-sizing: border-box;
  z-index: 10;
`;
const MiddlePanel = styled.div`
  height: 100%;
  position: relative;
  border-left: 3px solid;
  border-right: 3px solid;
  border-left-color: ${(props) => props.autoPlay ? colors.active[IDLE_COLOR_KEY] : colors.idle[IDLE_COLOR_KEY]};
  border-right-color: ${(props) => props.autoPlay ? colors.active[IDLE_COLOR_KEY] : colors.idle[IDLE_COLOR_KEY]};
`;
const CenterArea = styled.div`
  position: absolute;
  top: 50%;
  /* left: 50%; */
  right: 50%;
  transform: translate(50%, -50%);
  border: 5px solid white;
  box-sizing: border-box;
`;
const BottomPanel = styled.div`
  margin-top: auto;
  min-height: 20px;
  /* margin-bottom: 4px; */
  color: white;
  z-index: 10;
  border: 3px solid;
  border-color: ${(props) => props.autoPlay ? colors.active[IDLE_COLOR_KEY] : colors.idle[IDLE_COLOR_KEY]};
`;

function App() {
  const [savedOptions, saveOptions] = useLocalStorage(KEY_OPTIONS, {});
  const [selectedSaved, saveSelectedCCTVs] = useLocalStorage(
    KEY_SELECT_SAVED,
    [],
  );
  const [notSelectedSaved, saveNotSelectedCCTVs] = useLocalStorage(
    KEY_NOT_SELECT_SAVED,
    [],
  );
  const INITIAL_GRID_DIMENSION =
    savedOptions.gridDimension === undefined ? 2 : savedOptions.gridDimension;
  const INITIAL_AUTO_INTERVAL =
    savedOptions.autoInterval === undefined ? 10 : savedOptions.autoInterval;
  const INITIAL_REFRESH_MODE =
    savedOptions.refreshMode === undefined ? 'auto' : savedOptions.refreshMode;
  const INITIAL_REFRESH_INTERVAL =
    savedOptions.refreshInterval === undefined
      ? 1
      : savedOptions.refreshInterval;

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(true);
  const [gridDimension, setGridDimension] = React.useState(
    INITIAL_GRID_DIMENSION
  );
  const [autoPlay, setAutoPlay] = React.useState(false);
  const [autoInterval, setAutoInterval] = React.useState(INITIAL_AUTO_INTERVAL);
  const [checkedCCTVId, setCheckedCCTVId] = React.useState('');
  // const [currentCCTVIndex, setCurrentCCTVIndex] = React.useState(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [refreshMode, setRefreshMode] = React.useState(INITIAL_REFRESH_MODE);
  const [refreshInterval, setRefreshInterval] = React.useState(
    INITIAL_REFRESH_INTERVAL,
  );
  const [cctvsNotSelectedArray, setCCTVsNotSelectedArray] =
    React.useState(notSelectedSaved);
  const [cctvsSelectedArray, setCCTVsSelectedAray] =
    React.useState(selectedSaved);
  const [cctvLastLoadedTime, setLastLoadedTime] =
    React.useState(INITIAL_LOAD_TIME);

  useHotkeys('c', () => setDialogOpen(true));
  // const cctvIndexRef = React.useRef(0);
  const preLoadMapRef = React.useRef(new Map());
  const setLeftSmallPlayerRef = React.useRef(() => {});
  const autoplayTimer = React.useRef(null);
  const modalOpenRef = React.useRef(modalOpen);
  // const gridNumNormalized = getRealIndex(
  //   currentCCTVIndex,
  //   gridDimension,
  //   cctvsSelectedArray,
  // );
  const activeIndexRef = React.useRef(activeIndex);
  const cctvPlayersRef = React.useRef([]);
  const swiperRef = React.useRef(null);

  // const saveLastIndex = React.useCallback((index) => {
  //   cctvIndexRef.current = index;
  // }, []);

  React.useEffect(() => {
    if(swiperRef.current === null) return;
    swiperRef.current.on('realIndexChange', (e) => {
      // console.log('real index change: ',e)
      const { realIndex } = e;
      setActiveIndex(realIndex);
      activeIndexRef.current = realIndex;
    });
  // eslint-disable-next-line no-use-before-define
  }, []);

  // console.log('gridNumNormalized=', gridNumNormalized, currentCCTVIndex, cctvIndexRef.current)

  // React.useEffect(() => {
  //   if (cctvsSelectedArray.length > 0) {
  //     setCurrentCCTVIndex(0);
  //   }
  // }, [cctvsSelectedArray.length]);

  const gridNum2CCTVIndex = React.useCallback(
    (gridNum) => {
      return getRealIndex(gridNum, gridDimension, cctvsSelectedArray);
    },
    [cctvsSelectedArray, gridDimension],
  );

  const moveToSlide = React.useCallback((index) => {
    swiperRef.current.slideTo(index);
    // saveLastIndex(index);
    // setCurrentCCTVIndex(index);
  }, []);

  const handlePressKeyboard = React.useCallback(
    (_, handler) => {
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

  const reloadPlayerComponent = React.useCallback(
    (cctvIndex) => {
      // console.log('getNon: reload Player:', cctvIndex)
      setLastLoadedTime((lastLoadedTime) => {
        const now = Date.now();
        return replace(lastLoadedTime).index(cctvIndex).value(now);
      });
    },
    [setLastLoadedTime],
  );

  const runAutoPlay = React.useCallback(
    // eslint-disable-next-line default-param-last, @typescript-eslint/no-shadow
    (startAutoPlay = false, autoInterval) => {
      if (startAutoPlay) {
        document.title = `CCTV[auto - every ${autoInterval}s]`;
        const firstIndex = activeIndex;
        moveToSlide(firstIndex);
        autoplayTimer.current = setInterval(() => {
          let nextPlayerIndex =
            // (activeIndex + 1) % cctvPlayersRef.current.length;
            (activeIndexRef.current + 1) % cctvPlayersRef.current.length;
          let loopingCount = 0;
          while (true) {
            const nextPlayer = cctvPlayersRef.current[nextPlayerIndex];
            console.log('autoPlay:', cctvPlayersRef.current, nextPlayerIndex, nextPlayer)
            // console.log('check nextPlayer', nextPlayerIndex, nextPlayer)
            if (isPlayerPlaying(nextPlayer, nextPlayerIndex)) {
              break;
            } else {
              console.log('reload player:', nextPlayerIndex)
              reloadPlayerComponent(nextPlayerIndex);
              // eslint-disable-next-line no-plusplus
              nextPlayerIndex =
                (nextPlayerIndex + 1) % cctvPlayersRef.current.length;
            }
            // eslint-disable-next-line no-plusplus
            loopingCount++;
            if (loopingCount > 10) {
              console.error('max loop count exceed! just slideNext()');
              break;
            }
          }
          // swiperRef.current.slideNext();
          swiperRef.current.slideToLoop(nextPlayerIndex);
          // setCurrentCCTVIndex(nextPlayerIndex);
          // cctvIndexRef.current = nextPlayerIndex;
          // console.log('!!! nextIndex=', nextIndex, cctvPlayersRef.current[nextIndex].paused())
        }, autoInterval * 1000);
      } else {
        document.title = 'CCTV';
        clearInterval(autoplayTimer.current);
      }
      return () => {
        clearInterval(autoplayTimer.current);
      };
    },
    [activeIndex, moveToSlide, reloadPlayerComponent],
  );

  const toggleAutoPlay = React.useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    setAutoPlay((autoPlay) => {
      if (autoPlay) {
        runAutoPlay(false);
      } else {
        runAutoPlay(true, autoInterval);
      }
      return !autoPlay;
    });
  }, [autoInterval, runAutoPlay]);

  const setCCTVsSelectedArrayNSave = React.useCallback(
    (cctvsArray) => {
      setCCTVsSelectedAray(cctvsArray);
      saveSelectedCCTVs(cctvsArray);
    },
    [saveSelectedCCTVs],
  );

  const setCCTVsNotSelectedArrayNSave = React.useCallback(
    (cctvsArray) => {
      setCCTVsNotSelectedArray(cctvsArray);
      saveNotSelectedCCTVs(cctvsArray);
    },
    [saveNotSelectedCCTVs],
  );

  const setOptionsNSave = React.useCallback(
    (key, value) => {
      key === 'gridDimension' && setGridDimension(value);
      key === 'autoInterval' && setAutoInterval(value);
      key === 'refreshMode' && setRefreshMode(value);
      key === 'refreshInterval' && setRefreshInterval(value);
      const options = {
        ...savedOptions,
        [key]: value,
      };
      saveOptions(options);
    },
    [saveOptions, savedOptions],
  );

  const reloadApp = React.useCallback(() => {
    window.electron.ipcRenderer.sendMessage('reload');
  }, []);

  return (
    <Container autoPlay={autoPlay}>
      <TopPanel autoPlay={autoPlay}>
        <VideoStates
          cctvSelected={cctvsSelectedArray}
          currentCCTVIndex={activeIndex}
          cctvPlayersRef={cctvPlayersRef}
        />
        <button onClick={reloadApp}>reload</button>
      </TopPanel>
      <MiddlePanel autoPlay={autoPlay}>
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
              currentActiveIndex={activeIndex}
              cctvPlayersRef={cctvPlayersRef}
              cctvLastLoadedTime={cctvLastLoadedTime}
              setLastLoadedTime={setLastLoadedTime}
              refreshMode={refreshMode}
              refreshInterval={refreshInterval}
              reloadPlayerComponent={reloadPlayerComponent}
              currentCCTVIndex={activeIndex}
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
      <BottomPanel autoPlay={autoPlay}>
        <MessagePanel />
      </BottomPanel>
    </Container>
  );
}

export default App;
