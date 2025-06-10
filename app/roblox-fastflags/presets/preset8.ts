import { PresetFile } from "../types";

export const preset8: PresetFile = {
  id: "preset-8",
    title: "Unterial v2.25",
    description: "Anti Data sharing, Better WiFi/FPS Optimization, Reduce Latency/Delay/Frames. (change ur hardware settings)",
    content: JSON.stringify(
      {
        // [ Set the value to ur max Refresh Rate ]
           "FIntTargetRefreshRate": "360",
           "FIntRefreshRateLowerBound": "360",
           "DFIntGraphicsOptimizationModeFRMFrameRateTarget": "360",
     
        // [ Set the value to ur Logical Processor -1 ]
           "DFIntRuntimeConcurrency": "23",
           "FIntTaskSchedulerAutoThreadLimit": "23",
     
        // [ Render Quality Settings ]
           "DFIntDebugDynamicRenderKiloPixels": "",
     
           "FFlagDebugDisplayFPS": "True",
           "DFIntTaskSchedulerTargetFps": "5000",
           "FFlagTaskSchedulerLimitTargetFpsTo2402": "False",
     
           "FFlagMovePrerender": "False",
           "FFlagMovePrerenderV2": "False",
           "FFlagHandleAltEnterFullscreenManually": "False",
           "FFlagUserCameraControlLastInputTypeUpdate": "False",
     
           "FFlagSmoothInputOffset": "True",
           "FFlagFasterPreciseTime4": "True",
           "FFlagSortKeyOptimization": "True",
           "FFlagUserShowGuiHideToggles": "True",
           "FFlagOptimizeCFrameUpdates4": "True",
           "FFlagLuaMenuPerfImprovements": "True",
           "FFlagOptimizeCFrameUpdatesIC3": "True",
           "FFlagStylingFasterTagProcessing": "True",
           "FFlagAnimationCurveDenseCacheEnabled5": "True",
           "FFlagPreComputeAcceleratorArrayForSharingTimeCurve": "True",
     
           "DFFlagSimAdaptiveExplicitlyMarkInterpolatedAssemblies": "True",
           "DFFlagSimSmoothedRunningController2": "True",
           "FFlagSimDcdDeltaReplication": "True",
           "FFlagSimDcdRefactorDelta3": "True",
     
           "DFFlagReplicatorCheckReadTableCollisions": "True",
           "DFFlagReplicatorSeparateVarThresholds": "True",
           "DFFlagHumanoidReplicateSimulated2": "True",
           "DFFlagClampIncomingReplicationLag": "True",
           "DFFlagAddKtxTranscodedWidthHeight": "True",
           "DFFlagReplicateCreateToPlayer": "True",
           "DFFlagAddKtxTranscoderVersion": "True",
           "DFFlagAddKtxContentHash2": "True",
     
           "DFFlagUpdateBoundExtentsForHugeMixedReplicationComponents": "True",
           "DFFlagAcceleratorUpdateOnPropsAndValueTimeChange": "True",
           "DFFlagSolverStateReplicatedOnly2": "True",
           "DFFlagMergeFakeInputEvents3": "True",
     
           "FIntDefaultJitterN": "0",
           "DFIntMaxFrameBufferSize": "4",
           "FIntInterpolationMaxDelayMSec": "100",
           "DFIntGraphicsOptimizationModeMinFrameTimeTargetMs": "7",
           "DFIntGraphicsOptimizationModeMaxFrameTimeTargetMs": "25",
     
           "DFIntSessionIdlePeriod": "750",
           "DFIntInitialAccelerationLatencyMultTenths": "1",
           "DFIntTrackerLodProcessingExtrapolationTimeLowerBound": "5",
           "DFIntTrackerLodProcessingExtrapolationTimeUpperBound": "15",
             
           "FIntMaxTimestepMultiplierHumanoid": "5",
           "FIntMaxTimestepMultiplierAcceleration": "5",
           "DFIntTimestepArbiterCollidingHumanoidTsm": "185",
           "DFIntSimDefaultHumanoidTimestepMultiplier": "185",
           "DFIntTimestepArbiterHumanoidLinearVelThreshold": "15",
     
           "FFlagEnablePhysicsAdaptiveTimeSteppingIXP": "True",
           "DFFlagSimAdaptiveAdjustTimestepForControllerManager": "False",
           "FStringPhysicsAdaptiveTimeSteppingIXP": "Physics.DefaultTimeStepping",
     
           "DFIntRakNetLoopMs": "1",
           "DFIntRakNetSelectTimeoutMs": "1",
           "DFIntRakNetNakResendDelayMs": "1",
           "DFIntSendRakNetStatsInterval": "86400",
           "DFIntRakNetResendMinThresholdTimeInUs": "75000",
           "DFIntRakNetResendMaxThresholdTimeInUs": "1500000",
     
           "DFIntRakNetMinAckGrowthPercent": "25",
           "FIntRakNetResendBufferArrayLength": "256",
           "DFIntServerRakNetBandwidthPlayerSampleRate": "86400000",
           "DFIntNetworkObjectStatsCollectorGlobalCapThrottleHP": "128",
     
           "DFLogLargeReplicatorTrace": "False",
           "DFLogClientRecvFromRaknet": "False",
           "FFlagReportServerReplicatorStatsToEI": "False",
           "DFFlagCorrectServerReplicatorStatsIP": "False",
           "DFFlagRakNetTelemV2DownloadBwTracker": "False",
           "DFFlagRakNetSetUserIdInReliabilityLayer": "False",
           "DFFlagRakNetMissingPingUpgradeTelemetry": "False",
     
           "DFIntNetworkStreamInitSize": "32768",
           "DFIntNetworkStreamMinGrowSize": "131072",
           "DFIntNetworkStreamingGCMaxMicroSecondLimit": "3250",
     
           "FIntCLI20390_2": "1",
           "DFIntS2PhysicsSenderRate": "256",
           "DFIntMaxProcessPacketsJobScaling": "12500",
           "DFIntMaxProcessPacketsStepsPerCyclic": "6250",
     
           "DFIntJoinDataCompressionLevel": "0",
           "DFIntNetworkSchemaCompressionRatio": "0",
           "DFIntServerBandwidthPlayerSampleRateFacsOverride": "2147465500",
           "DFIntClusterSenderMaxUpdateBandwidthBps": "1205480000",
           "DFIntClusterSenderMaxJoinBandwidthBps": "1205480000",
           "DFIntServerBandwidthPlayerSampleRate": "2147465500",
           "DFIntSendGameServerDataMaxLen": "10485760",
     
           "DFIntMegaReplicatorNetworkQualityProcessorUnit": "10",
           "DFIntNetworkQualityResponderUnit": "10",
           "DFIntCanHideGuiGroupId": "35503415",
     
           "DFIntLatencyLoggingDumpLength": "5",
           "DFIntLatencyLoggingThresholdMs": "25000",
           "DFIntLatencyErrorMultiplierTennths": "15",
           "DFIntBacklogDetectorLatencyThresholdMs": "750",
           "FFlagEnableAXEnableAXClientLatencyLogging": "False",
           "DFIntReportSimulationToFBLatencyInfluxHundredthsPercentage": "0",
           
           "FFlagInsertServiceMenuTelemetry": "False",
           "FFlagEnableServiceInitBreakdownTelemetry": "False",
     
           "FFlagAdServiceEnabled": "False",
           "FLogBackendAdsProviderLog": "False",
           "FFlagLuaAppSponsoredGridTiles": "False",
           "FFlagEnableSponsoredAdsPerTileTooltipExperienceFooter": "False",
           "FFlagEnableSponsoredAdsSeeAllGamesListTooltip": "False",
           "FFlagEnableSponsoredTooltipForAvatarCatalog2": "False",
           "FFlagEnableSponsoredAdsGameCarouselTooltip3": "False",
     
           "DFFlagReportReplicatorStatsToTelemetryV22": "False",
           "DFFlagDebugDisableTelemetryAfterTest": "True",
           "DFFlagAnalyticsServiceEnabled": "False",
           "FFlagEnableTelemetryProtocol": "False",
           "FFlagEnableTelemetryService1": "False",
     
           "FStringTencentAuthPath": "",
           "DFStringTelegrafAddress": "192.0.2.1",
           "DFStringAltTelegrafAddress": "198.51.100.1",
           "DFStringHttpPointsReporterUrl": "https://opt-out.roblox.com/",
           "DFStringRobloxAnalyticsURL": "https://opt-out.roblox.com/",
           "DFStringTelemetryV2Url": "https://opt-out.roblox.com/"
     },
      null,
      2
    ),
    category: "performance",
    difficulty: "experimental",
    compatibility: ["Roblox"],
};
