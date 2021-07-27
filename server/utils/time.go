package utils

import "time"

func ConvertDate(timeParsed time.Time) int64 {
	return timeParsed.UnixNano() / int64(time.Millisecond)
}
