import React from 'react'
import styled from 'styled-components'

const MAX_MEMORY_MB = 1024;

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  font-size: 15px;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`
const Since = styled.div`
  margin-right: auto;
  margin-left: 10px;
`
const RightSide = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 10px;
  font-weight: bold;
`
const Version = styled.div`
  /* margin-right: 10px; */
`
const MemUsage = styled.div`
`
function MessagePanel(props) {
  const { autoPlay } = props;
  const [appVersion, setAppVersion] = React.useState('v.0.0.0');
  const [currentMem, setCurrentMem] = React.useState('0');
  const [autoPlayStartedTimestamp, setAutoPlayStartedTimestamp] = React.useState(null);
  const [elsapsed, setElapsed] = React.useState('00:00:00');
  // console.log('elapsed:', elsapsed)

  React.useEffect(() => {
    // eslint-disable-next-line promise/catch-or-return
    window.electron.ipcRenderer
      .getVersion()
      .then((version) => setAppVersion(version));
  }, []);

  React.useEffect(() => {
    if (autoPlay) {
      setAutoPlayStartedTimestamp(Date.now());
    } else {
      setAutoPlayStartedTimestamp(null);
    }
  }, [autoPlay]);

  const dateString = React.useMemo(() => {
    return new Date(autoPlayStartedTimestamp).toLocaleString();
  }, [autoPlayStartedTimestamp]);

  const handleMemInfo = React.useCallback((result) => {
    const { private: privateKB } = result;
    const memMB = (privateKB/1024).toFixed(1);
    setCurrentMem(memMB)
  }, []);

  React.useEffect(() => {
    let timer;
    if (autoPlay) {
      timer = setInterval(() => {
        setElapsed(() => {
          const diff = Date.now() - autoPlayStartedTimestamp;
          return new Date(diff).toISOString().slice(11, 19);
        });
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    }
  }, [autoPlay, autoPlayStartedTimestamp]);

  React.useEffect(() => {
    function getProcessMemory() {
      window.electron.ipcRenderer.sendMessage('getMemoryInfo');
      setTimeout(() => {
        requestAnimationFrame(getProcessMemory);
      }, 1000);
    }
    window.electron.ipcRenderer.on('getMemoryInfoResult', handleMemInfo);
    getProcessMemory();
    return () => {
      window.electron.ipcRenderer.off('getMemoryInfoResult', handleMemInfo);
    }
  }, [handleMemInfo]);

  const usagePercent = ((currentMem / MAX_MEMORY_MB) * 100).toFixed(1);
  return (
    <Container>
      {autoPlayStartedTimestamp ? (
        <Since>Auto Play From [{dateString}] - Elapsed [{elsapsed}]</Since>
      ):(
        <Since>Auto Play Off</Since>
      )}
      <RightSide>
        <Version>[v{appVersion}]</Version>
        <MemUsage>
          [{currentMem}MB ({usagePercent}%)]
        </MemUsage>
      </RightSide>
    </Container>
  )
}

export default React.memo(MessagePanel)

