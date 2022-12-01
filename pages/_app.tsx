import type { NextPage } from "next"
import React from "react"
import Watermark from "watermark-image"
import "./styles.css"

interface WatermarkInterface {
  text: string
  hex: string
  fontSize: number
  watermarkHeight: number
  watermarkWidth: number
  rgb: any
}

const Home: NextPage<WatermarkInterface> = () => {
  const inputFileRef = React.useRef<HTMLInputElement | null>(null)
  const [image, setImage] = React.useState(null)
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement>()
  const [isLoad, setIsLoad] = React.useState(false)

  const handleSubmit = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (!inputFileRef.current?.files?.length) {
      alert("Please select file")
      return
    }

    setIsLoad(true)

    /* Add files to FormData */
    const formData = new FormData()
    Object.values(inputFileRef.current.files).forEach((file) => {
      const url: any = URL.createObjectURL(file)
      const watermark = new Watermark(canvas as HTMLCanvasElement)
      let w: number = 0
      let h: number = 0
      const img = document.createElement("img")
      img.src = url
      img.onload = function () {
        w = img.width
        h = img.height
        if (w > 512 || h > 512) {
          alert("Please upload image with resolution 512 x 512")
          setIsLoad(false)
          return
        }
        setImage(url)
        watermark.draw(url, {
          text: "This is a Watermark",
          fontSize: 20,
          fillStyle: "rgb(255,255,255 ,1)",
          watermarkHeight: 180,
          watermarkWidth: 280,
        })

        formData.append("file", file)
        setIsLoad(false)
      }
    })
  }

  return (
    <>
      <form
        className="form-container"
        style={image ? { height: "fit-content" } : { height: "100vh" }}
        >
        <div className="canvas">
        <h1>Upload Image</h1>
          <div className="upload-files-class">
            <div>
              <input
                type="file"
                name="myfile"
                ref={inputFileRef}
                className="drag-area-class"
              />
            </div>
            <div>
              <input
                type="submit"
                value="Generate"
                disabled={isLoad}
                onClick={handleSubmit}
                className="btn-primary"
              />
              {isLoad && ` Wait, please...`}
            </div>
          </div>
          <div
            className={`upload-canvas-class`}
            style={image ? { display: "flex" } : { display: "none" }}
          >
            <h3 className="dynamic-message">
              Output
            </h3>
            <canvas
              id="canvas"
              style={{ width: 512, height: "100%" }}
              ref={(canvas: HTMLCanvasElement) => setCanvas(canvas)}
            />
          </div>
        </div>
      </form>
      <div className="form-container"></div>
    </>
  )
}

export default Home;
