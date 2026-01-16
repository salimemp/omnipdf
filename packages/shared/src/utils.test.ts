import {
  formatBytes,
  formatDate,
  formatRelativeTime,
  generateId,
  truncate,
  slugify,
  debounce,
  throttle,
  getFileExtension,
  getFilenameWithoutExtension,
  isValidFileType,
  getMimeType,
  sleep,
  retry,
  canConvert,
  getConvertibleFormats,
  SUPPORTED_FORMATS,
  CONVERSION_PAIRS,
} from "./utils";

describe("Utils", () => {
  describe("formatBytes", () => {
    test("formats 0 bytes", () => {
      expect(formatBytes(0)).toBe("0 Bytes");
    });

    test("formats bytes to KB", () => {
      expect(formatBytes(1024)).toBe("1 KB");
    });

    test("formats bytes to MB", () => {
      expect(formatBytes(1024 * 1024)).toBe("1 MB");
    });

    test("formats bytes to GB", () => {
      expect(formatBytes(1024 * 1024 * 1024)).toBe("1 GB");
    });

    test("formats with decimal places", () => {
      expect(formatBytes(1536)).toBe("1.5 KB");
    });

    test("handles large files", () => {
      expect(formatBytes(1024 * 1024 * 1024 * 5)).toBe("5 GB");
    });

    test("handles custom decimal places", () => {
      expect(formatBytes(1024, 3)).toBe("1.000 KB");
    });
  });

  describe("formatDate", () => {
    test("formats date string", () => {
      const date = "2024-01-15T10:30:00Z";
      expect(formatDate(date)).toBe("Jan 15, 2024");
    });

    test("formats Date object", () => {
      const date = new Date("2024-01-15T10:30:00Z");
      expect(formatDate(date)).toBe("Jan 15, 2024");
    });

    test("handles different dates", () => {
      const date = "2023-12-25T00:00:00Z";
      expect(formatDate(date)).toBe("Dec 25, 2023");
    });
  });

  describe("formatRelativeTime", () => {
    test('returns "just now" for recent times', () => {
      const now = new Date();
      expect(formatRelativeTime(now)).toBe("just now");
    });

    test("returns minutes ago", () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      expect(formatRelativeTime(fiveMinutesAgo)).toBe("5m ago");
    });

    test("returns hours ago", () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      expect(formatRelativeTime(twoHoursAgo)).toBe("2h ago");
    });

    test("returns days ago", () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(threeDaysAgo)).toBe("3d ago");
    });

    test("returns formatted date for older times", () => {
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      expect(formatRelativeTime(twoWeeksAgo)).toMatch(
        /[A-Z][a-z]{2} \d{1,2}, \d{4}/,
      );
    });
  });

  describe("generateId", () => {
    test("generates UUID format", () => {
      const id = generateId();
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    test("generates unique IDs", () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe("truncate", () => {
    test("returns original string if shorter", () => {
      expect(truncate("Hi", 10)).toBe("Hi");
    });

    test("truncates long strings", () => {
      expect(truncate("Hello World", 8)).toBe("Hello...");
    });

    test("handles exact length", () => {
      expect(truncate("Hello", 5)).toBe("Hello");
    });

    test("handles empty string", () => {
      expect(truncate("", 10)).toBe("");
    });

    test("handles zero length", () => {
      expect(truncate("Hello", 0)).toBe("...");
    });
  });

  describe("slugify", () => {
    test("converts to lowercase", () => {
      expect(slugify("HELLO")).toBe("hello");
    });

    test("removes special characters", () => {
      expect(slugify("Hello World!@#")).toBe("hello-world");
    });

    test("replaces spaces with hyphens", () => {
      expect(slugify("hello world")).toBe("hello-world");
    });

    test("handles multiple spaces", () => {
      expect(slugify("hello   world")).toBe("hello-world");
    });

    test("removes leading/trailing hyphens", () => {
      expect(slugify("  hello world  ")).toBe("hello-world");
    });
  });

  describe("debounce", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("delays function execution", () => {
      const fn = jest.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      expect(fn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test("only calls once for multiple rapid calls", () => {
      const fn = jest.fn();
      const debouncedFn = debounce(fn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe("throttle", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("calls function immediately", () => {
      const fn = jest.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test("throttles subsequent calls", () => {
      const fn = jest.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(fn).toHaveBeenCalledTimes(1);
    });

    test("allows calls after interval", () => {
      const fn = jest.fn();
      const throttledFn = throttle(fn, 100);

      throttledFn();
      expect(fn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe("getFileExtension", () => {
    test("extracts extension from filename", () => {
      expect(getFileExtension("document.pdf")).toBe("pdf");
    });

    test("handles uppercase extension", () => {
      expect(getFileExtension("document.PDF")).toBe("pdf");
    });

    test("handles multiple dots", () => {
      expect(getFileExtension("document.backup.pdf")).toBe("pdf");
    });

    test("returns empty string for no extension", () => {
      expect(getFileExtension("document")).toBe("");
    });
  });

  describe("getFilenameWithoutExtension", () => {
    test("removes extension", () => {
      expect(getFilenameWithoutExtension("document.pdf")).toBe("document");
    });

    test("handles multiple dots", () => {
      expect(getFilenameWithoutExtension("document.backup.pdf")).toBe(
        "document.backup",
      );
    });

    test("returns original if no extension", () => {
      expect(getFilenameWithoutExtension("document")).toBe("document");
    });
  });

  describe("isValidFileType", () => {
    test("returns true for valid type", () => {
      expect(isValidFileType("test.pdf", ["pdf", "docx"])).toBe(true);
    });

    test("returns false for invalid type", () => {
      expect(isValidFileType("test.exe", ["pdf", "docx"])).toBe(false);
    });

    test("is case insensitive", () => {
      expect(isValidFileType("test.PDF", ["pdf"])).toBe(true);
    });
  });

  describe("getMimeType", () => {
    test("returns correct MIME type for PDF", () => {
      expect(getMimeType("test.pdf")).toBe("application/pdf");
    });

    test("returns correct MIME type for DOCX", () => {
      expect(getMimeType("test.docx")).toBe(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      );
    });

    test("returns correct MIME type for images", () => {
      expect(getMimeType("test.jpg")).toBe("image/jpeg");
      expect(getMimeType("test.png")).toBe("image/png");
    });

    test("returns octet-stream for unknown", () => {
      expect(getMimeType("test.xyz")).toBe("application/octet-stream");
    });
  });

  describe("sleep", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test("resolves after specified time", async () => {
      const sleepPromise = sleep(100);
      expect(sleepPromise).resolves.toBeUndefined();
    });
  });

  describe("retry", () => {
    beforeEach(() => {
      jest.useRealTimers();
    });

    test("succeeds on first try", async () => {
      const fn = jest.fn().mockResolvedValue("success");
      const result = await retry(fn, 3, 10);
      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    test("retries on failure", async () => {
      let callCount = 0;
      const fn = jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.reject(new Error("fail"));
        }
        return Promise.resolve("success");
      });

      const result = await retry(fn, 3, 10);
      expect(result).toBe("success");
      expect(fn).toHaveBeenCalledTimes(2);
    });

    test("fails after max retries", async () => {
      const fn = jest.fn().mockRejectedValue(new Error("fail"));

      await expect(retry(fn, 2, 10)).rejects.toThrow("fail");
      expect(fn).toHaveBeenCalledTimes(3);
    });
  });

  describe("canConvert", () => {
    test("returns true for valid conversion", () => {
      expect(canConvert("pdf", "docx")).toBe(true);
    });

    test("returns false for invalid conversion", () => {
      expect(canConvert("pdf", "invalid")).toBe(false);
    });

    test("returns false for unknown format", () => {
      expect(canConvert("unknown", "pdf")).toBe(false);
    });
  });

  describe("getConvertibleFormats", () => {
    test("returns array of formats", () => {
      const formats = getConvertibleFormats("pdf");
      expect(Array.isArray(formats)).toBe(true);
      expect(formats).toContain("docx");
      expect(formats).toContain("xlsx");
    });

    test("returns empty array for unknown format", () => {
      expect(getConvertibleFormats("unknown")).toEqual([]);
    });
  });

  describe("SUPPORTED_FORMATS", () => {
    test("includes common formats", () => {
      expect(SUPPORTED_FORMATS).toContain("pdf");
      expect(SUPPORTED_FORMATS).toContain("docx");
      expect(SUPPORTED_FORMATS).toContain("xlsx");
      expect(SUPPORTED_FORMATS).toContain("jpg");
    });

    test("has all conversion pairs keys", () => {
      Object.keys(CONVERSION_PAIRS).forEach((key) => {
        expect(SUPPORTED_FORMATS).toContain(key);
      });
    });
  });
});
