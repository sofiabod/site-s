import { useRef } from 'react'

export default function FltTree() {
  const ref = useRef<HTMLVideoElement>(null)
  const restart = () => {
    ref.current!.currentTime = 0
    ref.current!.play()
  }
  return <video ref={ref} className="flt-tree" src="/flt-tree.mp4" autoPlay muted playsInline onClick={restart} />
}
