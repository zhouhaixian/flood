import axios from "axios";

export class OCR {
  public static readonly url = process.env.OCR_URL as string;

  public static async recognize(base64: string): Promise<string> {
    try {
      const response = await axios.post(`${this.url}/ocr/b64/json`, base64);
      return response.data.result;
    } catch {
      throw new OCRError("OCR request failed");
    }
  }

  public static async slideMatch(
    targetBase64: string,
    backgroundBase64: string
  ): Promise<{
    target_y: number;
    target: [number, number, number, number];
  }> {
    try {
      const response = await axios.post(
        `${this.url}/slide/match/b64/json`,
        btoa(
          JSON.stringify({
            target_img: targetBase64,
            bg_img: backgroundBase64,
          })
        )
      );
      return response.data.result;
    } catch (e: any) {
      throw new OCRError(`OCR request failed: ${e.message}`);
    }
  }
}

export class OCRError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OCRError";
  }
}
