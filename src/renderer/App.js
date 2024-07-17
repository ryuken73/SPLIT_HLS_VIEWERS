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
import 'swiper/css';

const KEY_OPTIONS = 'hlsCCTVOptions';
const KEY_SELECT_SAVED = 'selectedSavedCCTVs';
const KEY_NOT_SELECT_SAVED = 'notSelectedSavedCCTVs';
const INITIAL_LOAD_TIME = new Array(9).fill(Date.now());

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
  background-color: #282c34;
  border: 3px solid grey;
  box-sizing: border-box;
  z-index: 10;
`;
const MiddlePanel = styled.div`
  height: 100%;
  position: relative;
  border-left: 3px solid grey;
  border-right: 3px solid grey;
`;
const CenterArea = styled.div`
  position: absolute;
  top: 50%;
  /* left: 50%; */
  right: 5%;
  transform: translate(5%, -50%);
  border: 5px solid white;
  box-sizing: border-box;
`;
const BottomPanel = styled.div`
  margin-top: auto;
  min-height: 20px;
  /* margin-bottom: 4px; */
  color: white;
  z-index: 10;
  background-color: #282c34;
  border: 3px solid grey;
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
  const [currentCCTVIndex, setCurrentCCTVIndex] = React.useState(null);
  const [activeIndex, setActiveIndex] = React.useState(null);
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
  const cctvIndexRef = React.useRef(0);
  const preLoadMapRef = React.useRef(new Map());
  const setLeftSmallPlayerRef = React.useRef(() => {});
  const autoplayTimer = React.useRef(null);
  const modalOpenRef = React.useRef(modalOpen);
  const gridNumNormalized = getRealIndex(
    currentCCTVIndex,
    gridDimension,
    cctvsSelectedArray,
  );
  const cctvPlayersRef = React.useRef([]);
  const swiperRef = React.useRef(null);

  React.useEffect(() => {
    swiperRef.current.on('activeIndexChange', (e) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      console.log(e)
      const { activeIndex } = e;
      setActiveIndex(activeIndex);
    });
  }, []);

  // console.log('gridNumNormalized=', gridNumNormalized, currentCCTVIndex, cctvIndexRef.current)

  React.useEffect(() => {
    if (cctvsSelectedArray.length > 0) {
      setCurrentCCTVIndex(0);
    }
  }, [cctvsSelectedArray.length]);

  const gridNum2CCTVIndex = React.useCallback(
    (gridNum) => {
      return getRealIndex(gridNum, gridDimension, cctvsSelectedArray);
    },
    [cctvsSelectedArray, gridDimension],
  );

  const saveLastIndex = React.useCallback((index) => {
    cctvIndexRef.current = index;
  }, []);

  const moveToSlide = React.useCallback(
    (index) => {
      swiperRef.current.slideTo(index);
      saveLastIndex(index);
      setCurrentCCTVIndex(index);
    },
    [saveLastIndex],
  );

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
        const firstIndex = cctvIndexRef.current;
        moveToSlide(firstIndex);
        autoplayTimer.current = setInterval(() => {
          let nextPlayerIndex =
            (cctvIndexRef.current + 1) % cctvPlayersRef.current.length;
          let loopingCount = 0;
          while (true) {
            const nextPlayer = cctvPlayersRef.current[nextPlayerIndex];
            // console.log('check nextPlayer', nextPlayerIndex, nextPlayer)
            if (isPlayerPlaying(nextPlayer, nextPlayerIndex)) {
              break;
            } else {
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
          swiperRef.current.slideNext();
          setCurrentCCTVIndex(nextPlayerIndex);
          cctvIndexRef.current = nextPlayerIndex;
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
    [moveToSlide, reloadPlayerComponent],
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

  return (
    <Container>
      <TopPanel>
        <VideoStates
          cctvSelected={cctvsSelectedArray}
          currentCCTVIndex={currentCCTVIndex}
          cctvPlayersRef={cctvPlayersRef}
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
