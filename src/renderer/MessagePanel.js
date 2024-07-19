import React from 'react'
import styled from 'styled-components'
import BlinkingDot from './BlinkingDot';

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
const MemUsage = styled.div`
  margin-left: auto;
  margin-right: 10px;
`
function MessagePanel(props) {
  const { autoPlay } = props;
  const [currentMem, setCurrentMem] = React.useState('0');
  const [autoPlayStartedTimestamp, setAutoPlayStartedTimestamp] = React.useState(null);

  React.useEffect(() => {
    if (autoPlay) {
      setAutoPlayStartedTimestamp(Date.now())
    }
  }, [autoPlay]);

  const handleMemInfo = React.useCallback((result) => {
    const { private: privateKB } = result;
    const memMB = (privateKB/1024).toFixed(1);
    setCurrentMem(memMB)
  }, []);

  React.useEffect(() => {
    function getProcessMemory() {
      window.electron.ipcRenderer.sendMessage('getMemoryInfo');
      setTimeout(() => {
        requestAnimationFrame(getProcessMemory)
      }, 1000)
    }
    window.electron.ipcRenderer.on('getMemoryInfoResult', handleMemInfo);
    requestAnimationFrame(getProcessMemory)
    return () => {
      window.electron.ipcRenderer.off('getMemoryInfoResult', handleMemInfo);
    }
  }, [handleMemInfo]);
  const usagePercent = ((currentMem / MAX_MEMORY_MB) * 100).toFixed(1);
  return (
    <Container>
      <MemUsage>{currentMem}MB ({usagePercent}%)</MemUsage>
    </Container>
  )
}

export default React.memo(MessagePanel)

