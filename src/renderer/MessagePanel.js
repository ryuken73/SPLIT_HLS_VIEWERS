import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  font-size: 15px;
  align-items: center;
  justify-content: center;
`
const MemUsage = styled.div`
  margin-left: auto;
`
function MessagePanel() {
  const [currentMem, setCurrentMem] = React.useState('0');

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
  return (
    <Container>
      <MemUsage>{currentMem}MB</MemUsage>
    </Container>
  )
}

export default React.memo(MessagePanel)
