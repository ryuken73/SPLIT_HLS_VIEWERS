import './App.css';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import styled from 'styled-components';
import ConfigDialog from './ConfigDialog';
import GridVideos from './GridVideos';
import useLocalStorage from './hooks/useLocalStorage';
import MessagePanel from './MessagePanel';
import VideoStates from './Components/VideoStates';
import { isPlayerPlaying } from './lib/sourceUtil';
import { replace } from './lib/arrayUtil';
import colors from './lib/colors';
import DisplayStates from './Components/SideComponents/DisplayStates';
import ShowTitle from './Components/SideComponents/ShowTitle';
import AlignSide from './Components/SideComponents/AlignSide';
import SetTitleFont from './Components/SideComponents/SetTitleFont';
import SetTitleOpacity from './Components/SideComponents/SetTitleOpacity';
import SetTitleBlur from './Components/SideComponents/SetTitleBlur';
import SetMaxNumberOfResets from './Components/SideComponents/SetMaxNumberOfResets';
import ShowProgress from './Components/SideComponents/ShowProgress';
import 'swiper/css';
import { SmallButton } from './template/smallComponents';

const KEY_OPTIONS = 'hlsCCTVOptions';
const KEY_SELECT_SAVED = 'selectedSavedCCTVs';
const KEY_NOT_SELECT_SAVED = 'notSelectedSavedCCTVs';
const INITIAL_LOAD_TIME = new Array(9).fill(Date.now());

const ACTIVE_COLOR_KEY = 950;
const IDLE_COLOR_KEY = 400;
// const MAX_NUMBER_OF_RESETS = 50;

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${(props) =>
    props.autoPlay
      ? colors.autoRun[ACTIVE_COLOR_KEY]
      : colors.idle[ACTIVE_COLOR_KEY]};
`;
const TopPanel = styled.div`
  min-height: 100px;
  width: 100%;
  border: 3px solid;
  border-color: ${(props) =>
    props.autoPlay
      ? colors.autoRun[IDLE_COLOR_KEY]
      : colors.idle[IDLE_COLOR_KEY]};
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: hidden;
`;
const MiddlePanel = styled.div`
  height: 100%;
  position: relative;
  border-left: 3px solid;
  border-right: 3px solid;
  border-left-color: ${(props) =>
    props.autoPlay
      ? colors.autoRun[IDLE_COLOR_KEY]
      : colors.idle[IDLE_COLOR_KEY]};
  border-right-color: ${(props) =>
    props.autoPlay
      ? colors.autoRun[IDLE_COLOR_KEY]
      : colors.idle[IDLE_COLOR_KEY]};
  overflow: hidden;
  display: flex;
`;
const CenterArea = styled.div`
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  border: 5px solid white;
  box-sizing: border-box;
`;
const LeftArea = styled.div`
  color: white;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: auto;
  width: 150px;
`
const AbsoluteBox = styled.div`
  position: absolute;
  border: 2px solid white;
  padding: 15px;
  opacity: ${(props) => (props.showStat ? 1 : 0)};
  transition: 1s all;
`
const RightArea = styled(LeftArea)`
  margin-left: auto;
  padding-right: 10px;
`
const BottomPanel = styled.div`
  margin-top: auto;
  min-height: 20px;
  color: white;
  border: 3px solid;
  border-color: ${(props) =>
    props.autoPlay
      ? colors.autoRun[IDLE_COLOR_KEY]
      : colors.idle[IDLE_COLOR_KEY]};
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

  const [numberOfResets, setNumberOfResets] = React.useState(
    new Array(selectedSaved.length).fill(0)
  );
  const [alignBy, setAlignBy] = React.useState('right');
  const [titleFontSize, setTitleFontSize] = React.useState(3);
  const [videoStates, setVideoStates] = React.useState({});
  const [memUsage, setMemUsage] = React.useState(0);
  const [appStartTimestamp, setAappStartTimestamp] = React.useState(Date.now())
  const [elapsed, setElapsed] =  React.useState({
    num: 0,
    str: '00:00:00'
  });
  const [showStat, setShowStat] = React.useState(false);
  const [showTitle, setShowTitle] = React.useState(true);
  const [showProgress, setShowProgress] = React.useState(true);
  const [titleOpacity, setTitleOpacity] = React.useState(0.9);
  const [titleBlur, setTitleBlur] = React.useState(0);
  const [maxNumberOfResets, setMaxNumberOfResets] = React.useState(50);

  // console.log('stopped:', videoStates)
  useHotkeys('c', () => setDialogOpen(true));
  const preLoadMapRef = React.useRef(new Map());
  const setLeftSmallPlayerRef = React.useRef(() => {});
  const autoplayTimer = React.useRef(null);
  const modalOpenRef = React.useRef(modalOpen);
  const activeIndexRef = React.useRef(activeIndex);
  const cctvPlayersRef = React.useRef([]);
  const swiperRef = React.useRef(null);

  const totalVideos = cctvsSelectedArray.length;
  const numberOfStoppedVideos = Object.values(videoStates).filter(
    (videoState) => videoState !== 'normal'
  ).length;
  const videoStatesString = `${numberOfStoppedVideos}/${totalVideos}`
  const numberOfLIveStream = totalVideos - numberOfStoppedVideos;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(() => {
        const diff = Date.now() - appStartTimestamp;
        return {
          num: diff,
          str: new Date(diff).toISOString().slice(11, 19),
        }
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [appStartTimestamp]);

  React.useEffect(() => {
    if (swiperRef.current === null) return;
    swiperRef.current.on('realIndexChange', (e) => {
      // console.log('real index change: ',e)
      const { realIndex } = e;
      setActiveIndex(realIndex);
      activeIndexRef.current = realIndex;
    });
  }, []);


  const moveToSlide = React.useCallback((index) => {
    swiperRef.current.slideTo(index);
  }, []);

  const handlePressKeyboard = React.useCallback(
    (_, handler) => {
      const pressed = parseInt(handler.keys[0], 10);
      const targetIndex = (pressed - 1) % cctvPlayersRef.current.length;
      // console.log(`pressed ${pressed}, targetIndex is ${targetIndex} `);
      moveToSlide(targetIndex);
    },
    [moveToSlide],
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
    // eslint-disable-next-line @typescript-eslint/no-shadow
      setNumberOfResets((numberOfResets) => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        setMaxNumberOfResets((maxNumberOfResets) => {
          if (numberOfResets[cctvIndex] > maxNumberOfResets) {
            console.log('too many resets:', cctvIndex);
          } else {
            console.log('reload player:', cctvIndex);
            setLastLoadedTime((lastLoadedTime) => {
              const now = Date.now();
              return replace(lastLoadedTime).index(cctvIndex).value(now);
            });
            // eslint-disable-next-line @typescript-eslint/no-shadow
            setNumberOfResets((numberOfResets) => {
              const lastNumber = numberOfResets[cctvIndex];
              return replace(numberOfResets)
                .index(cctvIndex)
                .value(lastNumber + 1);
            });
          }
          return maxNumberOfResets;
        });
      return numberOfResets;
    });
    },
    [],
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
            (activeIndexRef.current + 1) % cctvPlayersRef.current.length;
          let loopingCount = 0;
          // eslint-disable-next-line no-constant-condition
          while (true) {
            const nextPlayer = cctvPlayersRef.current[nextPlayerIndex];
            if (isPlayerPlaying(nextPlayer, nextPlayerIndex)) {
              break;
            } else {
              const newEvent = new Event('error');
              nextPlayer.dispatchEvent(newEvent);
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

  const updateVideoStates = React.useCallback((cctvsArray) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    let currentCCTVS = cctvsArray;
    if (typeof cctvsArray === 'function') {
      currentCCTVS = cctvsArray(cctvsSelectedArray)
    }
    setVideoStates((videoStates) => {
      return currentCCTVS.reduce((acct, cctv) => {
        if (videoStates[cctv.url] !== undefined) {
          return {
            ...acct,
            [cctv.url]: videoStates[cctv.url]
          }
        }
        return acct;
      }, {});
    });
    },
    [cctvsSelectedArray],
  );

  const setCCTVsSelectedArrayNSave = React.useCallback(
    (cctvsArray) => {
      // console.log('setCCTV:', cctvsArray)
      setCCTVsSelectedAray(cctvsArray);
      saveSelectedCCTVs(cctvsArray);
      updateVideoStates(cctvsArray);
    },
    [saveSelectedCCTVs, updateVideoStates],
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

  const totalResets = numberOfResets.reduce((acct, num) => {
    return acct + num;
  }, 0);

  const MAX_MEM_USAGE = 100;
  const MIN_ALIVE_VIDEOS = 2;
  const MAX_ALIVE_TIMESTAMP = 43200000; // 12Hours

  const getAppStatus = React.useCallback(() => {
    if (memUsage > MAX_MEM_USAGE) {
      return 'WARN';
    }
    if (numberOfLIveStream <= MIN_ALIVE_VIDEOS) {
      return 'FATAL';
    }
    if (elapsed.num > MAX_ALIVE_TIMESTAMP) {
      return 'WARN';
    }
    return 'OK';
  }, [elapsed.num, memUsage, numberOfLIveStream])

  const attention = getAppStatus();

  const toggleShowStat = React.useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    setShowStat((showStat) => !showStat);
  }, []);

  return (
    <Container autoPlay={autoPlay}>
      <TopPanel autoPlay={autoPlay}>
        <VideoStates
          autoPlay={autoPlay}
          cctvSelected={cctvsSelectedArray}
          currentCCTVIndex={activeIndex}
          cctvPlayersRef={cctvPlayersRef}
          numberOfResets={numberOfResets}
          setVideoStates={setVideoStates}
          maxNumberOfResets={maxNumberOfResets}
        />
      </TopPanel>
      <MiddlePanel autoPlay={autoPlay}>
        <LeftArea>
          <SmallButton onClick={toggleShowStat}>
            {showStat ? 'HIDE STAT' : 'SHOW STAT'}
          </SmallButton>
          <AbsoluteBox showStat={showStat}>
            <DisplayStates title="Status" value={attention} isBig />
            <DisplayStates title="Memory Usage" value={`${memUsage}%`} />
            <DisplayStates title="Total Resets" value={totalResets} />
            <DisplayStates title="Stopped Videos" value={videoStatesString} />
            <DisplayStates title="Elapsed Time" value={elapsed.str} />
            <button onClick={reloadApp}>reload</button>
          </AbsoluteBox>
        </LeftArea>
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
              alignBy={alignBy}
              titleFontSize={titleFontSize}
              showTitle={showTitle}
              titleOpacity={titleOpacity}
              titleBlur={titleBlur}
              autoInterval={autoInterval}
              showProgress={showProgress}
            />
          )}
          <ConfigDialog
            open={dialogOpen}
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
        <RightArea>
          <ShowTitle showTitle={showTitle} setShowTitle={setShowTitle} />
          <AlignSide alignBy={alignBy} setAlignBy={setAlignBy} />
          <ShowProgress
            showProgress={showProgress}
            setShowProgress={setShowProgress}
          />
          <SetTitleFont
            titleFontSize={titleFontSize}
            setTitleFontSize={setTitleFontSize}
          />
          <SetTitleOpacity
            titleOpacity={titleOpacity}
            setTitleOpacity={setTitleOpacity}
          />
          <SetTitleBlur titleBlur={titleBlur} setTitleBlur={setTitleBlur} />
          <SetMaxNumberOfResets
            maxNumberOfResets={maxNumberOfResets}
            setMaxNumberOfResets={setMaxNumberOfResets}
           />
        </RightArea>
      </MiddlePanel>
      <BottomPanel autoPlay={autoPlay}>
        <MessagePanel autoPlay={autoPlay} setMemUsage={setMemUsage} />
      </BottomPanel>
    </Container>
  );
}

export default App;
