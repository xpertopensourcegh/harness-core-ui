import React, { useState, useCallback, useMemo } from 'react'
import { Container, Text, Tabs, Tab, Color } from '@wings-software/uikit'
import i18n from './LogAnalysisView.i18n'
import HighchartsReact from 'highcharts-react-official'
import Highcharts, { SeriesColumnOptions } from 'highcharts'
import css from './LogAnalysisView.module.scss'
import { LogAnalysisRow } from './LogAnalysisRow/LogAnalysisRow'
import getLogViewcolumnChartConfig from './LogViewColumnChartConfig'

interface LogAnalysisViewProps {
  startTime: number
  endTime: number
  environment: string
  service: string
}

const mockData = [
  {
    count: 1,
    logText: `nothing to see here, there is no risk`,
    anomalyType: `Low Risk`,
    trendData: []
  },
  {
    count: 235,
    logText: `java.lang.RuntimeException: javax.activity.InvalidActivityException: Invalid activity sleep  at invalid.InvalidExceptionGenerator.generateInvalidActivityException(InvalidExceptionGenerator.java:17)  at inside.RequestException.doGet(RequestException.java:131)  at javax.servlet.http.HttpServlet.service(HttpServlet.java:635)  at javax.servlet.http.HttpServlet.service(HttpServlet.java:742)  at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:231)  at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)  at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)  at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:193)  at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)  at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:199)  at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:96)  at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:493)  at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:137)  at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:81)  at org.apache.catalina.valves.AbstractAccessLogValve.invoke(AbstractAccessLogValve.java:660)  at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:87)  at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:343)  at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:798)  at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:66)  at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:808)  at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1498)  at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49)  at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)  at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)  at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)  at java.lang.Thread.run(Thread.java:748) Caused by: javax.activity.InvalidActivityException: Invalid activity sleep  ... 26 more `,
    anomalyType: `Unexpected Frequency`,
    trendData: []
  },
  {
    count: 122,
    logText: `java.lang.RuntimeException: java.io.InvalidClassException: com.planets.mars.LifeOnMars  at invalid.InvalidExceptionGenerator.generateInvalidClassException(InvalidExceptionGenerator.java:22)  at inside.RequestException.doGet(RequestException.java:134)  at javax.servlet.http.HttpServlet.service(HttpServlet.java:635)  at javax.servlet.http.HttpServlet.service(HttpServlet.java:742)  at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:231)  at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)  at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)  at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:193)  at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)  at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:199)  at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:96)  at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:493)  at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:137)  at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:81)  at org.apache.catalina.valves.AbstractAccessLogValve.invoke(AbstractAccessLogValve.java:660)  at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:87)  at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:343)  at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:798)  at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:66)  at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:808)  at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1498)  at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49)  at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)  at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)  at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)  at java.lang.Thread.run(Thread.java:748) Caused by: java.io.InvalidClassException: com.planets.mars.LifeOnMars  ... 26 more `,
    anomalyType: `Unknown Event`,
    trendData: []
  },
  {
    count: 1,
    logText: `java.lang.RuntimeException: java.io.IOException: Error reading and writing to file  at\nio.IOExceptionGenerator.generateIOException(IOExceptionGenerator.java:16)  at\ninside.RequestException.doGet(RequestException.java:128)  at\njavax.servlet.http.HttpServlet.service(HttpServlet.java:635)  at\njavax.servlet.http.HttpServlet.service(HttpServlet.java:742)  at\norg.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:231)  at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)  at\norg.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)  at\norg.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:193)  at\norg.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)  at\norg.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:199)  at\norg.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:96)  at\norg.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:493)  at\norg.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:137)  at\norg.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:81)  at\norg.apache.catalina.valves.AbstractAccessLogValve.invoke(AbstractAccessLogValve.java:660)  at\norg.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:87)  at\norg.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:343)  at\norg.apache.coyote.http11.Http11Processor.service(Http11Processor.java:798)  at\norg.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:66)  at\norg.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:808)  at\norg.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1498)  at\norg.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49)  at\njava.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)  at\njava.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)  at\norg.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)  at\njava.lang.Thread.run(Thread.java:748) Caused by: java.io.IOException: Error reading and writing to file  ... 26 more `,
    anomalyType: `Unexpected Frequency`,
    trendData: []
  },
  {
    count: 234,
    logText: `java.lang.RuntimeException: java.lang.InterruptedException: please let me do my stuff  at\ncom.thread.MultiThreadProcessor.process(MultiThreadProcessor.java:16)  at inside.RequestException.doGet(RequestException.java:113)  at javax.servlet.http.HttpServlet.service(HttpServlet.java:635)  at javax.servlet.http.HttpServlet.service(HttpServlet.java:742)  at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:231)  at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)  at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)  at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:193)  at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)  at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:199)  at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:96)  at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:493)  at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:137)  at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:81)  at org.apache.catalina.valves.AbstractAccessLogValve.invoke(AbstractAccessLogValve.java:660)  at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:87)  at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:343)  at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:798)  at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:66)  at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:808)  at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1498)  at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49)  at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)  at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)  at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)  at java.lang.Thread.run(Thread.java:748) Caused by: java.lang.InterruptedException: please let me do my stuff  ... 26 more `,
    anomalyType: `Unexpected Frequency`,
    trendData: []
  },
  {
    count: 3,
    logText: `java.lang.IllegalStateException: Unknown parameters in state  at org.state.StateMachine.executeState(StateMachine.java:13)  at inside.RequestException.doGet(RequestException.java:101)  at javax.servlet.http.HttpServlet.service(HttpServlet.java:635)  at javax.servlet.http.HttpServlet.service(HttpServlet.java:742)  at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:231)  at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)  at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)  at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:193)  at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)  at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:199)  at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:96)  at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:493)  at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:137)  at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:81)  at org.apache.catalina.valves.AbstractAccessLogValve.invoke(AbstractAccessLogValve.java:660)  at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:87)  at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:343)  at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:798)  at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:66)  at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:808)  at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1498)  at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49)  at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)  at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)  at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)  at java.lang.Thread.run(Thread.java:748) `,
    anomalyType: `Unexpected Frequency`,
    trendData: []
  },
  {
    count: 565,
    logText: `java.lang.OutOfMemoryError: JVM out of memory!!  at io.heap.MemoryManager.generate(MemoryManager.java:13)  at inside.RequestException.doGet(RequestException.java:119)  at javax.servlet.http.HttpServlet.service(HttpServlet.java:635)  at javax.servlet.http.HttpServlet.service(HttpServlet.java:742)  at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:231)  at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)  at org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:52)  at org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:193)  at org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)  at org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:199)  at org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:96)  at org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:493)  at org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:137)  at org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:81)  at org.apache.catalina.valves.AbstractAccessLogValve.invoke(AbstractAccessLogValve.java:660)  at org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:87)  at org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:343)  at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:798)  at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:66)  at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:808)  at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1498)  at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49)  at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)  at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)  at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)  at java.lang.Thread.run(Thread.java:748) `,
    anomalyType: `Unknown Event`,
    trendData: []
  }
]

const mockColumnChartData = [
  {
    type: 'column',
    name: 'Non-Anomalous',
    data: [5, 3, 4, 7, 2, 5, 3, 4, 7, 2, 5, 3, 4, 7, 2, 5, 3, 4, 7, 2, 5, 3, 4, 7, 2, 5, 3, 4, 7, 2],
    color: 'var(--blue-500)'
  },
  {
    type: 'column',
    name: 'Anomalous',
    data: [5, 3, 4, 7, 2, 5, 3, 4, 7, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    color: '#E02020'
  }
] as SeriesColumnOptions[]

export default function LogAnalysisView(_: LogAnalysisViewProps): JSX.Element {
  const [isAnomalousTabSelected, setAnomalousTabSelected] = useState(true)
  const [data] = useState(mockData)
  const onTabChangeCallback = useCallback((selectedTab: string) => {
    const isAnomalous = selectedTab === i18n.analysisTabs.anomalous
    setAnomalousTabSelected(isAnomalous)
  }, [])
  const filteredData = useMemo(
    () => (isAnomalousTabSelected ? data.filter(({ anomalyType }) => anomalyType !== 'Low Risk') : data),
    [data, isAnomalousTabSelected]
  )
  const columnChartOptions = useMemo(() => (data ? getLogViewcolumnChartConfig(mockColumnChartData) : []), [data])

  return (
    <Container className={css.main}>
      <Container className={css.heading}>
        <Text
          color={Color.BLACK}
          className={css.clusterHeading}
        >{`${i18n.clusterHeading.firstHalf}40${i18n.clusterHeading.secondHalf}`}</Text>
        <Container className={css.tabContainer}>
          <Tabs id="LogAnalysisTabs" onChange={onTabChangeCallback}>
            <Tab id={i18n.analysisTabs.anomalous}>{i18n.analysisTabs.anomalous}</Tab>
            <Tab id={i18n.analysisTabs.all}>{i18n.analysisTabs.all}</Tab>
          </Tabs>
        </Container>
      </Container>

      <Container className={css.columnChartContainer}>
        <HighchartsReact highcharts={Highcharts} options={columnChartOptions} />
      </Container>

      <Container className={css.logContainer}>
        <LogAnalysisRow data={filteredData} />
      </Container>
    </Container>
  )
}
