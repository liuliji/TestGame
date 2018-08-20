# Entice

#  到底是token还是session？

首先，为什么有session token，http是一个无状态的协议。

然后 session怎么做的？ 将id返回给客户端，一般使用cookie（如果id丢了，那就赖不着服务器了），服务器需要存储sessionId与用户信息的映射，还需要保存用户session的失效时间。如果用户量变大，服务器变多，还需要保证sessionid的唯一性，而且还需要保证session信息的一致性。当然可以使用redis完美解决这些问题，包括用户失效时间，sessionId->userInfo的映射，sessionId的唯一性，多服务器的session信息都存在redis上，所以一致性也得到了解决。

另外token的核心思想就是实现服务器无状态，就是将基本信息存储在token中，无论服务器怎么增加，将token发送到哪一个服务器上，都能正确解析token。
1. token的标准使用方式 json web token(jwt)。这种方式有什么优缺点。不受服务器控制，（session受服务器控制，从这方面再扩展说）
2. 我们怎么使用的token

 webapp的用户系统。总体使用token？+session？。使用cookie保存一个由 过期时间+加密(过期时间+id+uuid)来保存的，使用的一个非常快的加密算法（对称加密算法就算比较快了，我用的叫XXTEA），通过验证是否能正确解密以及过期时间是否一致完成信息的正确性验证。然后拿着id+uuid 去redis cache中查找用户信息（redis中以id+uuid作为key，user信息作为value存储），如果还查不到就去db中查，db中也保存了用户的登录信息（防止redis出现问题），而且每一次更新redis（更新的间隔可以大一些，比如2个小时或者多长时间），也会相应的去更新数据库。

> 为什么是id+uuid，因为我们需求是支持多点登录的，如果只是id作为key，不能支持多点登录，如果uuid作为key不能保证多服务器时key的唯一性，所以使用了id+uuid的策略。

使用一个AnalyzeInterceptor将cookie中的内容读出，除了要解析出auth_cookie，验证其正确性，并保存到ThreadLocal里面，还要取出并更新其他简单的cookie，如icon，username等。

拓展redis：包括后来的验证码的时效性，密码错误次数等等，全是用的redis。

拓展权限管理：
user增加roles列，保存roles id list；增加roles表，表示角色信息，保存了请求idlist；增加request表，表示每个需要验证权限的请求；

在程序启动的时候去加载所有的request表中的信息，就是加载所有的需要验证权限的请求。

然后在AnalyzeInterceptor后增加一个AuthInterceptor。当请求来了之后，在AuthInterceptor中判断是否该请求在当前用户的权限列表中，如果没在就直接gg，在的话 继续。

