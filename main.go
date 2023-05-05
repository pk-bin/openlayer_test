package main

import (
	nocache "github.com/alexander-melentyev/gin-nocache"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"io"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	gin.DefaultWriter = io.Discard
	router := gin.New()
	router.Use(nocache.NoCache())
	router.Use(cors.Default())
	//router.Use(static.Serve("/", static.LocalFile("board_control/", true)))
	router.Use(static.Serve("/", static.LocalFile("web_gis/", true)))
	router.Run(":8080")
}
