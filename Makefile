build:
	@go build main.go

run:
	@go run main.go

test:
	@go test

clean:
	@del *.exe
	@if exist release\ ( rmdir /s /q release )

all:
	@echo "Release Compiling for MacOS"
	env GOOS=darwin GOARCH=arm64 go build -ldflags "-s -w" -o release/mac_arm64_output main.go
	@echo "Release Compiling for Window"
	env GOOS=windows GOARCH=386 go build -ldflags "-s -w" -o release/window_x86_output.exe main.go
	env GOOS=windows GOARCH=amd64 go build -ldflags "-s -w" -o release/window_x64_output.exe main.go
	@echo "Release Compiling for linux"
	env GOOS=linux GOARCH=amd64 go build -ldflags "-s -w" -o release/linux_amd64_output main.go
	env GOOS=linux GOARCH=arm64 go build -ldflags "-s -w" -o release/linux_aarch64_output main.go