package ui

//go:generate go-bindata -pkg ui -fs -prefix "build/" -o ui-assets.go build/...

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path"
	"strings"
	"text/template"

	"go.zoe.im/x/version"
)

// make this configurable
var (
	_staticfs http.FileSystem

	RootPlaceholder = []byte("__root_path__") // same as set in package.json hoomepage
	RootTplKey      = []byte("{{ .Root }}")   // same as the struct field key

	tplStart    = []byte("{{")
	tplStartTmp = []byte("_fix_go_tpl_panic_")
)

// Option for apply Config
type Option func(c *Config)

// Prefix set the root of web
func Prefix(root string) Option {
	return func(c *Config) {
		// must start with /
		if root != "" && root[0] != '/' {
			root = "/" + root
		}
		c.Root = root
	}
}

// Metadata set the metadata for app config
func Metadata(v interface{}) Option {
	return func(c *Config) {
		c.Meta = v
	}
}

// Version set the version for app config
func Version(v string) Option {
	return func(c *Config) {
		c.Version = v
	}
}

// Config store fields
type Config struct {
	Root    string      `json:"root"` // !!!important can be with omitempty
	Version string      `json:"version,omitempty"`
	BuildAt string      `json:"build_at,omitempty"`
	Commit  string      `json:"commit,omitempty"`
	Meta    interface{} `json:"meta,omitempty"`

	Config string `json:"-,omitempty"` // must use this same as html

	trimPrefix bool // trim the root of url
}

func (c *Config) ensureString() {
	// clean Config
	c.Config = ""
	data, _ := json.Marshal(c)
	c.Config = string(data)
}

func (c *Config) apply(opts ...Option) {
	for _, o := range opts {
		o(c)
	}
}

func newConfig(otps ...Option) *Config {
	c := &Config{
		Root: "", // default use empty

		// load data from x/version package
		Version: version.GitVersion,
		BuildAt: version.BuildDate,
		Commit:  version.GitCommit,
	}

	c.apply(otps...)
	return c
}

// NewHandler return a ui handler
func NewHandler(opts ...Option) http.Handler {
	c := newConfig(opts...)

	// hack fix the content of go-bindata
	// only run once
	// TODO: how to set differect call
	modifyGoBindata(c)
	// load files from go-bindata
	fs := AssetFile()
	fss := http.FileServer(fs)

	// handle 404
	hdlr := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, err := fs.Open(path.Clean(r.URL.Path))
		if os.IsNotExist(err) {
			r.URL.Path = "/"
		}

		fss.ServeHTTP(w, r)
	})

	if c.trimPrefix {
		// the root should only be /*
		return http.StripPrefix(c.Root, hdlr)
	}

	return hdlr
}

// 1. a handelr for register: (prefix, )
// 2. a cmd for register: ui: export to files, serve a server

// global vars for go-bindata
var _originalAssets = map[string]*asset{}
var _newAssets = map[string]*asset{}

func modifyGoBindata(c *Config) {
	// make sure config genrated
	c.ensureString()

	for k, f := range _bindata {
		ast, err := f()

		if err != nil {
			continue
		}

		_originalAssets[k] = ast
		// read data and parse and replace

		_oldBytes := bytes.ReplaceAll(ast.bytes, RootPlaceholder, RootTplKey)

		// .map 文件中存在 {{}} 会panic
		// 先替换成其他代替字符
		// TODO: 优化
		if strings.HasSuffix(k, ".map") {
			_oldBytes = bytes.ReplaceAll(_oldBytes, tplStart, tplStartTmp)
		}

		_tpl := template.Must(template.New(k).Parse(string(_oldBytes)))

		var buf bytes.Buffer
		err = _tpl.Execute(&buf, c) // gzip
		if err != nil {
			log.Println("generate static file", k, "error:", err)
			continue
		}

		// 替换回来
		nbytes := buf.Bytes()
		if strings.HasSuffix(k, ".map") {
			nbytes = bytes.ReplaceAll(nbytes, tplStartTmp, tplStart)
		}

		// create a new ast
		info := bindataFileInfo{name: k, size: int64(buf.Len()), mode: ast.info.Mode(), modTime: ast.info.ModTime()}
		// TODO: replace bytes
		nast := &asset{bytes: nbytes, info: info}
		_newAssets[k] = nast

		// replace the origin f
		_bindata[k] = func() (*asset, error) {
			return nast, nil
		}
	}
}
