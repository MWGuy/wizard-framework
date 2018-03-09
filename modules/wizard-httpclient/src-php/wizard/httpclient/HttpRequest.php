<?php
namespace wizard\httpclient;


/**
 * Class HttpRequest
 * @package wizard\httpclient
 */
class HttpRequest
{
    /**
     * @var string
     */
    private $method = 'GET';

    /**
     * @var string|null
     */
    private $type = null;

    /**
     * @var string|null
     */
    private $responseType = null;

    /**
     * @var string
     */
    private $url = '';

    /**
     * @var mixed
     */
    private $data = null;

    /**
     * @var array
     */
    private $headers = [];

    /**
     * @var array
     */
    private $cookies = [];

    /**
     * @var null|string
     */
    private $userAgent = null;

    /**
     * @var null|callable
     */
    private $bodyParser = null;

    /**
     * HttpRequest constructor.
     * @param string $method
     * @param string $url
     * @param mixed $data
     */
    public function __construct(string $method, string $url, $data = null)
    {
        $this->method($method);
        $this->url($url);
        $this->data($data);
    }

    /**
     * @param null|string $method
     * @return string
     */
    function method(?string $method = null): ?string
    {
        if (func_num_args() === 0) {
            return $this->method;
        } else {
            $this->method = $method;
        }
    }

    /**
     * @param null|string $url
     * @return null|string
     */
    function url(?string $url = null): ?string
    {
        if (func_num_args() === 0) {
            return $this->url;
        } else {
            $this->url = $url;
        }
    }

    /**
     * @param null|mixed $data
     * @return mixed
     */
    function data($data = null)
    {
        if (func_num_args() === 0) {
            return $this->data;
        } else {
            $this->data = $data;
        }
    }

    /**
     * @param null|string $userAgent
     * @return null|string
     */
    function userAgent(?string $userAgent = null): ?string
    {
        if (func_num_args() === 0) {
            return $this->userAgent;
        } else {
            $this->userAgent = $userAgent;
        }
    }

    /**
     * NONE, XML, JSON, TEXT, URLENCODE, MULTIPART
     * @param null|string $type
     * @return string
     */
    function type(?string $type = null): string
    {
        if (func_num_args() === 0) {
            return $this->type;
        } else {
            $this->type = $type;
        }
    }

    /**
     * XML, JSON, TEXT, STREAM
     * @param null|string $type
     * @return string
     */
    function responseType(?string $type = null): string
    {
        if (func_num_args() === 0) {
            return $this->responseType;
        } else {
            $this->responseType = $type;
        }
    }

    /**
     * @param array|null $cookies
     * @return array|null
     */
    function cookies(?array $cookies = null): ?array
    {
        if (func_num_args() === 0) {
            return $this->cookies;
        } else {
            $this->cookies = $cookies;
        }
    }

    /**
     * @param array|null $headers
     * @return array|null
     */
    function headers(?array $headers = null): ?array
    {
        if (func_num_args() === 0) {
            return $this->headers;
        } else {
            $this->headers = $headers;
        }
    }

    /**
     * @param null|string $contentType
     * @return null|string
     */
    function contentType(?string $contentType = null): ?string
    {
        if (func_num_args() === 0) {
            return $this->headers['Content-Type'];
        } else {
            $this->headers['Content-Type'] = $contentType;
        }
    }

    /**
     * @param callable|null $callback
     * @return callable|null (mixed $body[, HttpResponse $res])
     */
    function bodyParser(?callable $callback = null): ?callable
    {
        if (func_num_args() === 0) {
            return $this->bodyParser;
        } else {
            $this->bodyParser = $callback;
        }
    }
}