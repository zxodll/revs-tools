"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Search,
  Download,
  FileText,
  Info,
  RefreshCw,
  Filter,
  Monitor,
  Cpu,
  Smartphone,
  Gamepad2,
  Palette,
  Settings,
} from "lucide-react";

// Types
export interface FastFlagFile {
  id: string;
  name: string;
  content: string;
  isValid: boolean;
  isModified: boolean;
  lastModified: Date;
  size: number;
}

export interface PresetFile {
  id: string;
  title: string;
  description: string;
  content: string;
  category:
  | "performance"
  | "graphics"
  | "mobile"
  | "desktop";
  difficulty: "safe" | "experimental";
  compatibility: string[];
}

interface PresetBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (preset: PresetFile) => void;
}

// Available categories for FastFlag presets
const AVAILABLE_CATEGORIES = [
  { value: "performance", label: "Performance", icon: Cpu },
  { value: "graphics", label: "Graphics", icon: Palette },
  { value: "mobile", label: "Mobile", icon: Smartphone },
  { value: "desktop", label: "Desktop", icon: Monitor },
];

// Recommended FastFlag presets
const RECOMMENDED_PRESETS: PresetFile[] = [
  {
    id: "preset-1",
    title: "Unterial v2.0",
    description:
      "Anti Data sharing, Better WiFi/FPS Optimization, Reduce Latency/Delay/Frames. (change ur hardware settings)",
    content: JSON.stringify(
      {
        "FIntTargetRefreshRate": "240",
        "FIntRefreshRateLowerBound": "240",
        "DFIntGraphicsOptimizationModeFRMFrameRateTarget": "240",
        "FIntTaskSchedulerAutoThreadLimit": "15",
        "DFIntRuntimeConcurrency": "15",
        "DFIntDebugDynamicRenderKiloPixels": "2074",
        "FFlagDebugDisplayFPS": "True",
        "DFIntTaskSchedulerTargetFps": "5000",
        "FFlagTaskSchedulerLimitTargetFpsTo2402": "False",
        "FFlagMovePrerender": "False",
        "FFlagMovePrerenderV2": "False",
        "FFlagHandleAltEnterFullscreenManually": "False",
        "FFlagSimSolverLimitMaxMotorAcceleration": "False",
        "FFlagUserCameraControlLastInputTypeUpdate": "False",
        "FFlagSmoothInputOffset": "True",
        "FFlagFasterPreciseTime4": "True",
        "FFlagSortKeyOptimization": "True",
        "FFlagLuaMenuPerfImprovements": "True",
        "FFlagStylingFasterTagProcessing": "True",
        "FFlagHumanoidStateUseRuntimeSyncPrims": "True",
        "FFlagAnimationCurveDenseCacheEnabled5": "True",
        "FFlagKeyframeSequenceUseRuntimeSyncPrims": "True",
        "FFlagPreComputeAcceleratorArrayForSharingTimeCurve": "True",
        "DFFlagUpdateBoundExtentsForHugeMixedReplicationComponents": "True",
        "DFFlagAcceleratorUpdateOnPropsAndValueTimeChange": "True",
        "DFFlagHumanoidReplicateSimulated2": "True",
        "DFFlagMergeFakeInputEvents3": "True",
        "FFlagSimDcdEnableDelta2": "True",
        "FFlagSimDcdRefactorDelta3": "True",
        "DFFlagSimSmoothedRunningController2": "True",
        "DFFlagSimAdaptiveScaleCollisionParameters": "True",
        "DFFlagSimOptimizeGeometryChangedAssemblies3": "True",
        "DFFlagSimAdaptiveExplicitlyMarkInterpolatedAssemblies": "True",
        "FIntDefaultJitterN": "0",
        "DFIntMaxFrameBufferSize": "4",
        "FIntInterpolationMaxDelayMSec": "100",
        "FIntFullscreenTitleBarTriggerDelayMillis": "86400000",
        "DFIntPerformanceControlFrameTimeMax": "1",
        "DFIntPerformanceControlFrameTimeMaxUtility": "-1",
        "DFIntGraphicsOptimizationModeMinFrameTimeTargetMs": "7",
        "DFIntGraphicsOptimizationModeMaxFrameTimeTargetMs": "25",
        "DFIntTimestepArbiterCollidingHumanoidTsm": "125",
        "DFIntSimDefaultHumanoidTimestepMultiplier": "125",
        "DFIntSimTimestepMultiplierDebounceCount": "521470",
        "DFIntTimestepArbiterHumanoidTurningVelThreshold": "4",
        "DFIntTimestepArbiterHumanoidLinearVelThreshold": "10",
        "DFIntSimExplicitlyCappedTimestepMultiplier": "615284700",
        "DFFlagSimStepPhysicsCheckTimeStep": "True",
        "FFlagSimStepPhysicsEnableTelemetry": "False",
        "FFlagEnablePhysicsAdaptiveTimeSteppingIXP": "True",
        "DFFlagSimAdaptiveAdjustTimestepForControllerManager": "False",
        "DFIntSessionIdlePeriod": "750",
        "DFIntInitialAccelerationLatencyMultTenths": "1",
        "DFIntTrackerLodProcessingExtrapolationTimeLowerBound": "1",
        "DFIntTrackerLodProcessingExtrapolationTimeUpperBound": "8",
        "DFIntRakNetLoopMs": "1",
        "DFIntRakNetSelectTimeoutMs": "1",
        "DFIntRakNetNakResendDelayMs": "1",
        "DFIntRakNetResendRttMultiple": "1",
        "DFIntRakNetNakResendDelayMsMax": "5",
        "DFIntSendRakNetStatsInterval": "86400",
        "DFIntRakNetResendMinThresholdTimeInUs": "5000",
        "DFIntRakNetResendMaxThresholdTimeInUs": "50000",
        "DFIntRakNetClockDriftAdjustmentPerPingMillisecond": "1",
        "DFIntRakNetMinAckGrowthPercent": "0",
        "DFIntRakNetApplicationFeedbackMaxSpeedBPS": "0",
        "DFIntServerRakNetBandwidthPlayerSampleRate": "2147465500",
        "DFIntRakNetApplicationFeedbackScaleUpThresholdPercent": "0",
        "DFIntRakNetApplicationFeedbackScaleUpFactorHundredthPercent": "0",
        "DFLogLargeReplicatorTrace": "False",
        "DFLogClientRecvFromRaknet": "False",
        "DFFlagReplicatorCheckReadTableCollisions": "True",
        "DFFlagReplicatorSeparateVarThresholds": "True",
        "FFlagDataModelUseRuntimeSyncPrims": "True",
        "DFFlagSolverStateReplicatedOnly2": "True",
        "FFlagSimDcdDeltaReplication": "True",
        "DFFlagRakNetEnablePoll": "True",
        "DFFlagRakNetDetectNetUnreachable": "True",
        "FFlagNetProcessingFairnessEnabled2": "True",
        "DFFlagRakNetCalculateApplicationFeedback2": "False",
        "DFFlagRakNetUnblockSelectOnShutdownByWritingToSocket": "True",
        "FIntRakNetResendBufferArrayLength": "256",
        "DFIntClientPacketMaxDelayMs": "1",
        "DFIntClientPacketMinMicroseconds": "1",
        "DFIntClientPacketExcessMicroseconds": "8",
        "DFIntClientPacketMaxFrameMicroseconds": "1047483647",
        "DFIntMaxProcessPacketsJobScaling": 5000000,
        "DFIntMaxProcessPacketsStepsAccumulated": 7,
        "DFIntMaxProcessPacketsStepsPerCyclic": 1047483647,
        "DFIntReportNetworkSyncMemoryUsage2EveryXSeconds": "1500",
        "DFIntNetworkStreamingGCMaxMicroSecondLimit": "2500",
        "DFIntNetworkStreamMinGrowSize": "32768",
        "DFIntNetworkStreamInitSize": "8192",
        "FIntCLI20390_2": "1",
        "DFIntEmaHalfLife": "20",
        "DFIntS2PhysicsSenderRate": "256",
        "DFIntTouchSenderMaxBandwidthBps": "8192",
        "DFIntTouchSenderMaxBandwidthBpsScaling": "10",
        "DFIntMaxDebugNetworkUpdateTimestamps": "5",
        "DFIntNetworkObjectStatsCollectorGlobalCapThrottleHP": "25",
        "DFIntSendItemLimit": "512",
        "DFIntClusterCompressionLevel": "0",
        "DFIntJoinDataCompressionLevel": "0",
        "DFIntNetworkSchemaCompressionRatio": "0",
        "DFIntServerBandwidthPlayerSampleRateFacsOverride": "2147465500",
        "DFIntClusterSenderMaxUpdateBandwidthBps": "1205480000",
        "DFIntClusterSenderMaxJoinBandwidthBps": "1205480000",
        "DFIntServerBandwidthPlayerSampleRate": "2147465500",
        "DFIntSendGameServerDataMaxLen": "10485760",
        "DFIntMaxDataPacketPerSend": "8000000",
        "DFIntMaxDataOutJobScaling": "25000000",
        "DFIntBufferDataTotalLimit": "2147483647",
        "DFIntDataSenderMaxBandwidthBpsMultiplier": "256",
        "DFIntDataSenderMaxJoinBandwidthBps": "1205480000",
        "DFIntReplicatorVariantContainerCountLimit": "2147465500",
        "DFIntCanHideGuiGroupId": "35503415",
        "DFIntNetworkQualityResponderUnit": "10",
        "DFIntMegaReplicatorNetworkQualityProcessorUnit": "10",
        "DFFlagDebugDisableTelemetryAfterTest": "True",
        "FFlagSkipJoinedSessionLog": "True",
        "FFlagCrashAnalyze142342": "False",
        "FFlagCrashAnalysis146784": "False",
        "FFlagEnableTelemetryProtocol": "False",
        "FFlagEnableTelemetryService1": "False",
        "DFFlagAnalyticsServiceEnabled": "False",
        "DFFlagReportReplicatorStatsToTelemetryV22": "False",
        "DFFlagEngineAPICloudProcessingServiceMasterSwitch": "False",
        "FFlagCLI_146266_GenerationServiceHttpHelperTelemetryUpdate": "False",
        "FFlagCLI_146266_GenerationServiceTelemetry": "False",
        "FFlagAdServiceEnabled": "False",
        "FLogBackendAdsProviderLog": "False",
        "FFlagLuaAppSponsoredGridTiles": "False",
        "FFlagEnableSponsoredAdsPerTileTooltipExperienceFooter": "False",
        "FFlagEnableSponsoredAdsSeeAllGamesListTooltip": "False",
        "FFlagEnableSponsoredTooltipForAvatarCatalog2": "False",
        "FFlagEnableSponsoredAdsGameCarouselTooltip3": "False",
        "FStringTencentAuthPath": "xxx",
        "FStringCoreScriptBacktraceErrorUploadToken": "xxx",
        "DFStringTelegrafAddress": "192.0.2.1",
        "DFStringAltTelegrafAddress": "198.51.100.1",
        "DFStringCrashUploadToBacktraceBaseUrl": "https://localhost/",
        "DFStringHttpPointsReporterUrl": "https://localhost/",
        "DFStringRobloxAnalyticsURL": "https://localhost/",
        "DFStringTelemetryV2Url": "https://localhost/",
        "DFStringLogUploadToBacktraceSynchronousToken": "",
        "DFStringLogUploadToBacktraceToken": "",
        "DFStringLightstepToken": ""
      },
      null,
      2
    ),
    category: "performance",
    difficulty: "experimental",
    compatibility: ["Roblox"],
  },
  {
    id: "preset-2",
    title: "Mahorga & Unterial v2.0 Default",
    description:
      "More FPS optimization, Default settings. (change ur hardware settings)",
    content: JSON.stringify(
      {
        "DFFlagUpdateBoundExtentsForHugeMixedReplicationComponents": "True",
        "DFFlagSimAdaptiveExplicitlyMarkInterpolatedAssemblies": "True",
        "DFFlagRakNetUnblockSelectOnShutdownByWritingToSocket": "True",
        "DFFlagSimAdaptiveAdjustTimestepForControllerManager": "False",
        "DFFlagTeleportClientAssetPreloadingDoingExperiment2": "True",
        "DFFlagEngineAPICloudProcessingServiceMasterSwitch": "False",
        "DFFlagTeleportClientAssetPreloadingDoingExperiment": "True",
        "DFFlagSimSolverSendPerfTelemetryToElasticSearch2": "False",
        "DFFlagAcceleratorUpdateOnPropsAndValueTimeChange": "True",
        "DFFlagTeleportClientAssetPreloadingEnabledIXP2": "True",
        "DFFlagEnableSkipUpdatingGlobalTelemetryInfo2": "False",
        "DFFlagTeleportClientAssetPreloadingEnabledIXP": "True",
        "DFFlagPerformanceControlEnableMemoryProbing3": "True",
        "DFFlagSimOptimizeGeometryChangedAssemblies3": "True",
        "DFFlagReportReplicatorStatsToTelemetryV22": "False",
        "DFFlagRakNetCalculateApplicationFeedback2": "False",
        "DFFlagEmitSafetyTelemetryInCallbackEnable": "False",
        "DFFlagRobloxTelemetryAddDeviceRAMPointsV2": "False",
        "DFFlagSimAdaptiveScaleCollisionParameters": "True",
        "DFFlagRccLoadSoundLengthTelemetryEnabled": "False",
        "DFFlagReplicatorCheckReadTableCollisions": "True",
        "DFFlagReplicatorSeparateVarThresholds": "True",
        "DFFlagRemoveTelemetryFlushOnJobClose": "False",
        "DFFlagRobloxTelemetryV2PointEncoding": "False",
        "DFFlagDebugDisableTelemetryAfterTest": "True",
        "DFFlagDebugPVLOD0SerializeFullMatrix": "True",
        "DFFlagDSTelemetryV2ReplaceSeparator": "False",
        "DFFlagGraphicsQualityUsageTelemetry": "False",
        "DFFlagReportAssetRequestV1Telemetry": "False",
        "DFFlagReportRenderDistanceTelemetry": "False",
        "DFFlagSimSmoothedRunningController2": "True",
        "DFFlagHttpTrackSyncWriteCachePhase": "True",
        "DFFlagCollectAudioPluginTelemetry": "False",
        "DFFlagRobloxTelemetryAddDeviceRAM": "False",
        "DFFlagSendRenderFidelityTelemetry": "False",
        "DFFlagSimStepPhysicsCheckTimeStep": "True",
        "DFFlagAddKtxTranscodedWidthHeight": "True",
        "DFFlagLargeReplicatorEngineModule": "True",
        "DFFlagClampIncomingReplicationLag": "True",
        "DFFlagHumanoidReplicateSimulated2": "True",
        "DFFlagRakNetDetectNetUnreachable": "True",
        "DFFlagSolverStateReplicatedOnly2": "True",
        "DFFlagEnableFmodErrorsTelemetry": "False",
        "DFFlagEnableTelemetryV2FRMStats": "False",
        "DFFlagEnablePreloadAvatarAssets": "True",
        "DFFlagAnalyticsServiceEnabled": "False",
        "DFFlagReplicateCreateToPlayer": "True",
        "DFFlagEnableTexturePreloading": "True",
        "DFFlagGpuVsCpuBoundTelemetry": "False",
        "DFFlagSampleAndRefreshRakPing": "True",
        "DFFlagTaskSchedulerAvoidSleep": "True",
        "DFFlagMergeFakeInputEvents3": "True",
        "DFFlagEnableSoundPreloading": "True",
        "DFFlagAlwaysSkipDiskCache": "False",
        "DFFlagAddMipPackMetadata": "True",
        "DFFlagSimOptimizeSetSize": "True",
        "DFFlagAddKtxContentHash": "True",
        "DFFlagFastEndUpdateLoop": "True",
        "DFFlagLightGridSimdNew3": "True",
        "DFFlagRakNetEnablePoll": "True",
        "DFFlagDebugPerfMode": "True",

        "DFIntCheckPVDifferencesForInterpolationMinRotVelThresholdRadsPerSecHundredth": "0",
        "DFIntCheckPVDifferencesForInterpolationMinVelThresholdStudsPerSecHundredth": "1",
        "DFIntCheckPVLinearVelocityIntegrateVsDeltaPositionThresholdPercent": "1",
        "DFIntGameNetPVHeaderRotationOrientIdToleranceExponent": "-2147483647",
        "DFIntGameNetPVHeaderRotationalVelocityZeroCutoffExponent": "-5000",
        "DFIntSignalRCoreHubConnectionDisconnectInfoHundredthsPercent": "5",
        "DFIntContentProviderPreloadHangTelemetryHundredthsPercentage": "0",
        "DFIntTeleportClientAssetPreloadingHundredthsPercentage2": "100000",
        "DFIntHumanoidStateChangeEventIngestThrottleHundrethsPercent": "0",
        "DFIntRakNetApplicationFeedbackScaleUpFactorHundredthPercent": "0",
        "DFIntTeleportClientAssetPreloadingHundredthsPercentage": "100000",
        "DFIntServerBandwidthPlayerSampleRateFacsOverride": "2147465500",
        "DFIntGameNetPVHeaderLinearVelocityZeroCutoffExponent": "-5000",
        "DFIntInterpolationFrameRotVelocityThresholdMillionth": "10",
        "DFIntGameNetPVHeaderTranslationZeroCutoffExponent": "-5000",
        "DFIntIncorrectlyPausedReplicationHundredthsPercentage": "0",
        "DFIntRakNetApplicationFeedbackScaleUpThresholdPercent": "0",
        "DFIntNetworkObjectStatsCollectorGlobalCapThrottleHP": "25",
        "DFIntTrackerLodProcessingExtrapolationTimeUpperBound": "8",
        "DFIntTrackerLodProcessingExtrapolationTimeLowerBound": "1",
        "DFIntGameNetDontSendRedundantDeltaThresholdMillionth": "1",
        "DFIntNetworkStopProducingPacketsToProcessThresholdMs": "0",
        "DFIntServerRakNetBandwidthPlayerSampleRate": "2147465500",
        "DFIntGameNetDontSendRedundantDeltaPositionMillionth": "1",
        "DFIntJoinDataItemEstimatedCompressionRatioHundreths": "0",
        "DFIntReportNetworkSyncMemoryUsage2EveryXSeconds": "1500",
        "DFIntSimExplicitlyCappedTimestepMultiplier": "615284700",
        "DFIntHttpCacheEvictionExemptionMapMaxSize": "2147483647",
        "DFIntHttpCacheReportSlowWritesMinDuration": "2147483647",
        "DFIntUserIdPlayerNameCacheLifetimeSeconds": "2147483647",
        "DFIntReportCacheDirSizesHundredthsPercent": "2147483647",
        "DFIntGraphicsOptimizationModeMaxFrameTimeTargetMs": "25",
        "DFIntInterpolationFramePositionThresholdMillionth": "10",
        "DFIntInterpolationFrameVelocityThresholdMillionth": "10",
        "DFIntReplicatorCountLimitInfluxHundrethsPercentage": "0",
        "DFIntReplicatorVariantContainerCountLimit": "2147465500",
        "DFIntRakNetClockDriftAdjustmentPerPingMillisecond": "1",
        "DFIntHttpCacheCleanUpToAvailableSpaceMiB": "2147483647",
        "DFIntGraphicsOptimizationModeMinFrameTimeTargetMs": "7",
        "DFIntClusterSenderMaxUpdateBandwidthBps": "1205480000",
        "DFIntGraphicsOptimizationModeFRMFrameRateTarget": "60",
        "DFIntHttpCacheAsyncWriterMaxPendingSize": "2147483647",
        "DFIntSoundServiceCacheCleanupMaxAgeDays": "2147483647",
        "DFIntBandwidthManagerApplicationDefaultBps": "1024000",
        "DFIntMaxReceiveToDeserializeLatencyMilliseconds": "10",
        "DFIntSignalRHubConnectionHeartbeatTimerRateMs": "1000",
        "DFIntTimestepArbiterHumanoidLinearVelThreshold": "10",
        "DFIntTimestepArbiterHumanoidTurningVelThreshold": "4",
        "DFIntBandwidthManagerDataSenderMaxWorkCatchupMs": "8",
        "DFIntClusterEstimatedCompressionRatioHundredths": "0",
        "DFIntCommonQueuePreserializeParallelBatchSize": "152",
        "DFIntMegaReplicatorNetworkQualityProcessorUnit": "10",
        "DFIntReplicatorVariantKickRateLimitMax": "2147483647",
        "DFIntMemoryUtilityCurveBaseHundrethsPercent": "10000",
        "DFIntTrackCountryRegionAPIHundredthsPercent": "10000",
        "DFIntClusterSenderMaxJoinBandwidthBps": "1205480000",
        "DFIntClientPacketMaxFrameMicroseconds": "1047483647",
        "DFIntNetworkInDeserializeLimitGameplayMsClient": "3",
        "DFIntReplicationVariantKickLimitBytes": "2147483647",
        "DFIntServerBandwidthPlayerSampleRate": "2147465500",
        "DFIntNetworkStreamingGCMaxMicroSecondLimit": "2500",
        "DFIntThirdPartyInMemoryCacheCapacity": "2147483647",
        "DFIntMaxProcessPacketsStepsPerCyclic": "1047483647",
        "DFIntMaxNumReplicatorsToDisconnectPerFrame": "2000",
        "DFIntSimTimestepMultiplierDebounceCount": "521470",
        "DFIntHttpCachePerfHundredthsPercent": "2147483647",
        "DFIntClientNetworkInfluxHundredthsPercentage": "0",
        "DFIntReplicationVariantLimitHundredthPercent": "0",
        "DFIntSignalRHubConnectionConnectTimeoutMs": "2000",
        "DFIntDataSenderMaxJoinBandwidthBps": "1205480000",
        "DFIntSimDefaultHumanoidTimestepMultiplier": "125",
        "DFIntHttpCacheCleanScheduleAfterMs": "2147483647",
        "DFIntPerformanceControlFrameTimeMaxUtility": "-1",
        "DFIntNetworkInDeserializeLimitGameplayMsRcc": "3",
        "DFIntDataSenderMaxBandwidthBpsMultiplier": "256",
        "DFIntTimestepArbiterCollidingHumanoidTsm": "125",
        "DFIntMaxWaitTimeBeforeForcePacketProcessMS": "1",
        "DFIntClientPacketHealthyAllocationPercent": "20",
        "DFIntSignalRHubConnectionBaseRetryTimeMs": "100",
        "DFIntRakNetApplicationFeedbackMaxSpeedBPS": "0",
        "DFIntRakNetResendMaxThresholdTimeInUs": "50000",
        "DFIntInitialAccelerationLatencyMultTenths": "1",
        "DFIntMemoryUtilityCurveTotalMemoryReserve": "0",
        "DFIntRakNetResendMinThresholdTimeInUs": "5000",
        "DFIntAssetCacheErrorLogHundredthsPercent": "0",
        "DFIntCheckPVCachedRotVelThresholdPercent": "0",
        "DFIntTouchSenderMaxBandwidthBpsScaling": "10",
        "DFIntHttpCachePerfSamplingRate": "2147483647",
        "DFIntNetworkQualityResponderMaxWaitTime": "1",
        "DFIntMaxProcessPacketsJobScaling": "5000000",
        "DFIntMaxProcessPacketsStepsAccumulated": "7",
        "DFIntSignalRCoreKeepAlivePingPeriodMs": "25",
        "DFIntCachedPatchLoadDelayMilliseconds": "1",
        "DFIntGameNetDontSendRedundantNumTimes": "1",
        "DFIntSignalRCoreRpcQueueSize": "2147483647",
        "DFIntSignalRCoreHandshakeTimeoutMs": "3000",
        "DFIntCheckPVCachedVelThresholdPercent": "0",
        "DFIntWaitOnUpdateNetworkLoopEndedMS": "100",
        "DFIntSendGameServerDataMaxLen": "10485760",
        "DFIntMaxDebugNetworkUpdateTimestamps": "5",
        "DFIntLargePacketQueueSizeCutoffMB": "1000",
        "DFIntSignalRHeartbeatIntervalSeconds": "1",
        "DFIntMemoryUtilityCurveNumSegments": "100",
        "DFIntMemCacheMaxCapacityMB": "2147483647",
        "DFIntPerformanceControlFrameTimeMax": "1",
        "DFIntClientPacketExcessMicroseconds": "8",
        "DFIntSignalRCoreServerTimeoutMs": "20000",
        "DFIntNumAssetsMaxToPreload": "2147483647",
        "DFIntBatchThumbnailResultsSizeCap": "200",
        "DFIntBufferDataTotalLimit": "2147483647",
        "DFIntTouchSenderMaxBandwidthBps": "8192",
        "DFIntFileCacheReserveSize": "2147483647",
        "DFIntSignalRCoreHubMaxBackoffMs": "5000",
        "DFIntNetworkSchemaCompressionRatio": "0",
        "DFIntSignalRCoreHubMaxElapsedMs": "1000",
        "DFIntNetworkStreamMinGrowSize": "32768",
        "DFIntNetworkQualityResponderUnit": "10",
        "DFIntSimDesiredVelocityDiffCutoff": "0",
        "DFIntPreloadAvatarAssets": "2147483647",
        "DFIntMaxDataOutJobScaling": "25000000",
        "DFIntSendRakNetStatsInterval": "86400",
        "DFIntClientPacketMinMicroseconds": "1",
        "DFIntSimAdaptiveExtraIterations": "32",
        "DFIntSignalRCoreHubBaseRetryMs": "10",
        "DFIntHttpBatchApi_cacheDelayMs": "15",
        "DFIntWaitOnRecvFromLoopEndedMS": "10",
        "DFIntMaxDataPacketPerSend": "8000000",
        "DFIntRakNetMinAckGrowthPercent": "0",
        "DFIntRakNetNakResendDelayMsMax": "5",
        "DFIntTaskSchedulerTargetFps": "5000",
        "DFIntCodecMaxIncomingPackets": "100",
        "DFIntCodecMaxOutgoingFrames": "1000",
        "DFIntNetworkStreamInitSize": "8192",
        "DFIntAssetPreloading": "2147483647",
        "DFIntJoinDataCompressionLevel": "0",
        "DFIntMaxAcceptableUpdateDelay": "1",
        "DFIntServerFramesBetweenJoins": "1",
        "DFIntCanHideGuiGroupId": "35503415",
        "DFIntClusterCompressionLevel": "0",
        "DFIntHttpBatchApi_maxWaitMs": "40",
        "DFIntRakNetResendRttMultiple": "1",
        "DFIntClientPacketMaxDelayMs": "1",
        "DFIntBufferCompressionLevel": "0",
        "DFIntHttpBatchApi_minWaitMs": "5",
        "DFIntRakNetNakResendDelayMs": "1",
        "DFIntRakNetSelectTimeoutMs": "1",
        "DFIntS2PhysicsSenderRate": "256",
        "DFIntSessionIdlePeriod": "750",
        "DFIntSignalRCoreTimerMs": "50",
        "DFIntRuntimeConcurrency": "3",
        "DFIntMaxFrameBufferSize": "4",
        "DFIntCharacterLoadTime": "1",
        "DFIntDataSenderRate": "240",
        "DFIntSendItemLimit": "512",
        "DFIntEmaHalfLife": "20",
        "DFIntRakNetLoopMs": "1",

        "DFLogClientRecvFromRaknet": "False",
        "DFLogLargeReplicatorTrace": "False",

        "DFStringCrashUploadToBacktraceBaseUrl": "https://localhost/",
        "DFStringHttpPointsReporterUrl": "https://localhost/",
        "DFStringLogUploadToBacktraceSynchronousToken": "",
        "DFStringRobloxAnalyticsURL": "https://localhost/",
        "DFStringTelemetryV2Url": "https://localhost/",
        "DFStringAltTelegrafAddress": "198.51.100.1",
        "DFStringLogUploadToBacktraceToken": "",
        "DFStringTelegrafAddress": "192.0.2.1",
        "DFStringLightstepToken": "",

        "FFlagCLI_146266_GenerationServiceHttpHelperTelemetryUpdate": "False",
        "FFlagEnableSponsoredAdsPerTileTooltipExperienceFooter": "False",
        "FFlagDebugNextGenReplicatorEnabledWriteCFrameColor": "True",
        "FFlagPreComputeAcceleratorArrayForSharingTimeCurve": "True",
        "FFlagEnablePreferredTextSizeStyleFixesInAppShell3": "True",
        "FFlagEnablePreferredTextSizeStyleFixesInAvatarExp": "True",
        "FFlagEnableSponsoredAdsSeeAllGamesListTooltip": "False",
        "FFlagClearCacheableContentProviderOnGameLaunch": "True",
        "FFlagEnablePartyVoiceOnlyForUnfilteredThreads": "False",
        "FFlagEnableSponsoredTooltipForAvatarCatalog2": "False",
        "FFlagEnableSponsoredAdsGameCarouselTooltip3": "False",
        "FFlagCLI_146266_GenerationServiceTelemetry": "False",
        "FFlagUISUseLastFrameTimeInUpdateInputSignal": "True",
        "FFlagEnablePreferredTextSizeSettingInMenus2": "True",
        "FFlagUserCameraControlLastInputTypeUpdate": "False",
        "FFlagDebugDisableTelemetryEphemeralCounter": "True",
        "FFlagEnablePartyVoiceOnlyForEligibleUsers": "False",
        "FFlagEnablePhysicsAdaptiveTimeSteppingIXP": "True",
        "FFlagContentProviderPreloadHangTelemetry": "False",
        "FFlagSimSolverLimitMaxMotorAcceleration": "False",
        "FFlagKeyframeSequenceUseRuntimeSyncPrims": "True",
        "FFlagChatTranslationEnableSystemMessage": "False",
        "FFlagVideoServiceAddHardwareCodecMetrics": "True",
        "FFlagDebugDisableTelemetryEphemeralStat": "True",
        "FFlagRenderLegacyShadowsQualityRefactor": "True",
        "FFlagTaskSchedulerLimitTargetFpsTo2402": "False",
        "FFlagHandleAltEnterFullscreenManually": "False",
        "FFlagEnablePreferredTextSizeGuiService": "True",
        "FFlagAnimationCurveDenseCacheEnabled5": "True",
        "FFlagHumanoidStateUseRuntimeSyncPrims": "True",
        "FFlagDebugDisableTelemetryEventIngest": "True",
        "FFlagUseCachedAudibilityMeasurements": "True",
        "FFlagEnableInGameMenuDurationLogger": "False",
        "FFlagBetaBadgeLearnMoreLinkFormview": "False",
        "FFlagSimStepPhysicsEnableTelemetry": "False",
        "FFlagLargeReplicatorSerializeWrite2": "True",
        "FFlagNextGenReplicatorEnabledWrite4": "True",
        "FFlagDebugDisableTelemetryV2Counter": "True",
        "FFlagNetProcessingFairnessEnabled2": "True",
        "FFlagLargeReplicatorSerializeRead2": "True",
        "FFlagGlobalSettingsEngineModule3": "False",
        "FFlagDebugForceFSMCPULightCulling": "True",
        "FFlagDataModelUseRuntimeSyncPrims": "True",
        "FFlagDebugDisableTelemetryV2Event": "True",
        "FFlagEnablePreferredTextSizeScale": "True",
        "FFlagFixSensitivityTextPrecision": "False",
        "FFlagRenderSkipReadingShaderData": "False",
        "FFlagDebugNextGenRepAttributeRep": "True",
        "FFlagDebugDisableTelemetryV2Stat": "True",
        "FFlagUserBetterInertialScrolling": "True",
        "FFlagStylingFasterTagProcessing": "True",
        "FFlagDebugDisableTelemetryPoint": "True",
        "FFlagImproveShiftLockTransition": "True",
        "FFlagMessageBusCallOptimization": "True",
        "FFlagPreloadTextureItemsOption4": "True",
        "FFlagLuaAppSponsoredGridTiles": "False",
        "FFlagDebugCheckRenderThreading": "True",
        "FFlagControlBetaBadgeWithGuac": "False",
        "FFlagHighlightOutlinesOnMobile": "True",
        "FFlagEnableTelemetryService1": "False",
        "FFlagEnableTelemetryProtocol": "False",
        "FFlagOptimizeCFrameUpdatesIC3": "True",
        "FFlagDebugGraphicsPreferD3D11": "True",
        "FFlagQuaternionPoseCorrection": "True",
        "FFlagLargeReplicatorEnabled6": "True",
        "FFlagLuaMenuPerfImprovements": "True",
        "FFlagPushFrameTimeToHarmony": "True",
        "FFlagOptimizeCFrameUpdates2": "True",
        "FFlagOptimizeCFrameUpdates4": "True",
        "FFlagSimDcdDeltaReplication": "True",
        "FFlagLoginPageOptimizedPngs": "True",
        "FFlagUserShowGuiHideToggles": "True",
        "FFlagLargeReplicatorWrite5": "True",
        "FFlagEnableQuickGameLaunch": "True",
        "FFlagOptimizeCFrameUpdates": "True",
        "FFlagCrashAnalysis146784": "False",
        "FFlagSkipJoinedSessionLog": "True",
        "FFlagLargeReplicatorRead5": "True",
        "FFlagFastGPULightCulling3": "True",
        "FFlagSimDcdRefactorDelta3": "True",
        "FFlagCrashAnalyze142342": "False",
        "FFlagSortKeyOptimization": "True",
        "FFlagShoeSkipRenderMesh": "False",
        "FFlagFasterPreciseTime4": "True",
        "FFlagSimDcdEnableDelta2": "True",
        "FFlagAssetPreloadingIXP": "True",
        "FFlagAdServiceEnabled": "False",
        "FFlagSmoothInputOffset": "True",
        "FFlagRenderCBRefactor2": "True",
        "FFlagD3D11SupportBGRA": "True",
        "FFlagMovePrerenderV2": "False",
        "FFlagDebugDisplayFPS": "True",
        "FFlagPreloadAllFonts": "True",
        "FFlagVoiceBetaBadge": "False",
        "FFlagMovePrerender": "False",
        "FFlagAddDMLogging": "False",
        "FFlagLuauCodegen": "True",

        "FIntTaskSchedulerTasksDefaultMaxTimeMsPerCycle": "2147483647",
        "FIntPreferredTextSizeSettingBetaFeatureRolloutPercent": "100",
        "FIntTaskSchedulerTasksDefaultMaxCountPerCycle": "2147483647",
        "FIntFullscreenTitleBarTriggerDelayMillis": "86400000",
        "FIntSmoothMouseSpringFrequencyTenths": "100",
        "FIntRakNetResendBufferArrayLength": "256",
        "FIntRuntimeMaxNumOfConditions": "1000000",
        "FIntRuntimeMaxNumOfSchedulers": "1000000",
        "FIntRuntimeMaxNumOfSemaphores": "1000000",
        "FIntRenderMeshOptimizeVertexBuffer": "1",
        "FIntCameraMaxZoomDistance": "2147483647",
        "FIntActivatedCountTimerMSKeyboard": "0",
        "FIntTaskSchedulerAutoThreadLimit": "3",
        "FIntRuntimeMaxNumOfLatches": "1000000",
        "FIntRuntimeMaxNumOfMutexes": "1000000",
        "FIntRuntimeMaxNumOfThreads": "1000000",
        "FIntInterpolationMaxDelayMSec": "100",
        "FIntActivatedCountTimerMSMouse": "0",
        "FIntLuauNormalizeCacheLimit": "0",
        "FIntRefreshRateLowerBound": "60",
        "FIntRuntimeMaxNumOfDPCs": "64",
        "FIntTargetRefreshRate": "60",
        "FIntDefaultJitterN": "0",
        "FIntCLI20390_2": "1",

        "FLogBackendAdsProviderLog": "False",

        "FStringCoreScriptBacktraceErrorUploadToken": "xxx",
        "FStringVoiceBetaBadgeLearnMoreLink": "null",
        "FStringGetPlayerImageDefaultTimeout": "1",
        "FStringTencentAuthPath": "xxx"
      },
      null,
      2
    ),
    category: "performance",
    difficulty: "experimental",
    compatibility: ["Roblox"],
  },
  {
    id: "preset-3",
    title: "Mahorga & Unterial v2.0 Low",
    description:
      "More FPS optimization, Low graphics settings. (change ur hardware settings)",
    content: JSON.stringify(
      {
        "DFFlagUpdateBoundExtentsForHugeMixedReplicationComponents": "True",
        "DFFlagSimAdaptiveExplicitlyMarkInterpolatedAssemblies": "True",
        "DFFlagRakNetUnblockSelectOnShutdownByWritingToSocket": "True",
        "DFFlagSimAdaptiveAdjustTimestepForControllerManager": "False",
        "DFFlagTeleportClientAssetPreloadingDoingExperiment2": "True",
        "DFFlagEngineAPICloudProcessingServiceMasterSwitch": "False",
        "DFFlagTeleportClientAssetPreloadingDoingExperiment": "True",
        "DFFlagAcceleratorUpdateOnPropsAndValueTimeChange": "True",
        "DFFlagTeleportClientAssetPreloadingEnabledIXP2": "True",
        "DFFlagTeleportClientAssetPreloadingEnabledIXP": "True",
        "DFFlagPerformanceControlEnableMemoryProbing3": "True",
        "DFFlagSimOptimizeGeometryChangedAssemblies3": "True",
        "DFFlagReportReplicatorStatsToTelemetryV22": "False",
        "DFFlagRakNetCalculateApplicationFeedback2": "False",
        "DFFlagSimAdaptiveScaleCollisionParameters": "True",
        "DFFlagReplicatorCheckReadTableCollisions": "True",
        "DFFlagReplicatorSeparateVarThresholds": "True",
        "DFFlagDebugRenderForceTechnologyVoxel": "True",
        "DFFlagDebugDisableTelemetryAfterTest": "True",
        "DFFlagDebugPVLOD0SerializeFullMatrix": "True",
        "DFFlagSimSmoothedRunningController2": "True",
        "DFFlagTextureQualityOverrideEnabled": "True",
        "DFFlagHttpTrackSyncWriteCachePhase": "True",
        "DFFlagRobloxTelemetryAddDeviceRAM": "False",
        "DFFlagSimStepPhysicsCheckTimeStep": "True",
        "DFFlagAddKtxTranscodedWidthHeight": "True",
        "DFFlagLargeReplicatorEngineModule": "True",
        "DFFlagClampIncomingReplicationLag": "True",
        "DFFlagHumanoidReplicateSimulated2": "True",
        "DFFlagRakNetDetectNetUnreachable": "True",
        "DFFlagSolverStateReplicatedOnly2": "True",
        "DFFlagEnablePreloadAvatarAssets": "True",
        "DFFlagAnalyticsServiceEnabled": "False",
        "DFFlagReplicateCreateToPlayer": "True",
        "DFFlagEnableTexturePreloading": "True",
        "DFFlagSampleAndRefreshRakPing": "True",
        "DFFlagTaskSchedulerAvoidSleep": "True",
        "DFFlagDebugOverrideDPIScale": "False",
        "DFFlagDebugSkipMeshVoxelizer": "True",
        "DFFlagMergeFakeInputEvents3": "True",
        "DFFlagEnableSoundPreloading": "True",
        "DFFlagAlwaysSkipDiskCache": "False",
        "DFFlagAddMipPackMetadata": "True",
        "DFFlagSimOptimizeSetSize": "True",
        "DFFlagAddKtxContentHash": "True",
        "DFFlagFastEndUpdateLoop": "True",
        "DFFlagLightGridSimdNew3": "True",
        "DFFlagRakNetEnablePoll": "True",
        "DFFlagDisableDPIScale": "False",
        "DFFlagDebugPerfMode": "True",

        "DFIntCheckPVDifferencesForInterpolationMinRotVelThresholdRadsPerSecHundredth": "0",
        "DFIntCheckPVDifferencesForInterpolationMinVelThresholdStudsPerSecHundredth": "1",
        "DFIntCheckPVLinearVelocityIntegrateVsDeltaPositionThresholdPercent": "1",
        "DFIntGameNetPVHeaderRotationOrientIdToleranceExponent": "-2147483647",
        "DFIntGameNetPVHeaderRotationalVelocityZeroCutoffExponent": "-5000",
        "DFIntSignalRCoreHubConnectionDisconnectInfoHundredthsPercent": "5",
        "DFIntContentProviderPreloadHangTelemetryHundredthsPercentage": "0",
        "DFIntTeleportClientAssetPreloadingHundredthsPercentage2": "100000",
        "DFIntHumanoidStateChangeEventIngestThrottleHundrethsPercent": "0",
        "DFIntRakNetApplicationFeedbackScaleUpFactorHundredthPercent": "0",
        "DFIntTeleportClientAssetPreloadingHundredthsPercentage": "100000",
        "DFIntServerBandwidthPlayerSampleRateFacsOverride": "2147465500",
        "DFIntGameNetPVHeaderLinearVelocityZeroCutoffExponent": "-5000",
        "DFIntInterpolationFrameRotVelocityThresholdMillionth": "10",
        "DFIntGameNetPVHeaderTranslationZeroCutoffExponent": "-5000",
        "DFIntIncorrectlyPausedReplicationHundredthsPercentage": "0",
        "DFIntRakNetApplicationFeedbackScaleUpThresholdPercent": "0",
        "DFIntNetworkObjectStatsCollectorGlobalCapThrottleHP": "25",
        "DFIntTrackerLodProcessingExtrapolationTimeUpperBound": "8",
        "DFIntTrackerLodProcessingExtrapolationTimeLowerBound": "1",
        "DFIntGameNetDontSendRedundantDeltaThresholdMillionth": "1",
        "DFIntNetworkStopProducingPacketsToProcessThresholdMs": "0",
        "DFIntServerRakNetBandwidthPlayerSampleRate": "2147465500",
        "DFIntGameNetDontSendRedundantDeltaPositionMillionth": "1",
        "DFIntJoinDataItemEstimatedCompressionRatioHundreths": "0",
        "DFIntReportNetworkSyncMemoryUsage2EveryXSeconds": "1500",
        "DFIntSimExplicitlyCappedTimestepMultiplier": "615284700",
        "DFIntHttpCacheEvictionExemptionMapMaxSize": "2147483647",
        "DFIntHttpCacheReportSlowWritesMinDuration": "2147483647",
        "DFIntUserIdPlayerNameCacheLifetimeSeconds": "2147483647",
        "DFIntReportCacheDirSizesHundredthsPercent": "2147483647",
        "DFIntGraphicsOptimizationModeMaxFrameTimeTargetMs": "25",
        "DFIntInterpolationFramePositionThresholdMillionth": "10",
        "DFIntInterpolationFrameVelocityThresholdMillionth": "10",
        "DFIntReplicatorCountLimitInfluxHundrethsPercentage": "0",
        "DFIntReplicatorVariantContainerCountLimit": "2147465500",
        "DFIntRakNetClockDriftAdjustmentPerPingMillisecond": "1",
        "DFIntHttpCacheCleanUpToAvailableSpaceMiB": "2147483647",
        "DFIntGraphicsOptimizationModeMinFrameTimeTargetMs": "7",
        "DFIntClusterSenderMaxUpdateBandwidthBps": "1205480000",
        "DFIntGraphicsOptimizationModeFRMFrameRateTarget": "60",
        "DFIntHttpCacheAsyncWriterMaxPendingSize": "2147483647",
        "DFIntSoundServiceCacheCleanupMaxAgeDays": "2147483647",
        "DFIntBandwidthManagerApplicationDefaultBps": "1024000",
        "DFIntMaxReceiveToDeserializeLatencyMilliseconds": "10",
        "DFIntSignalRHubConnectionHeartbeatTimerRateMs": "1000",
        "DFIntTimestepArbiterHumanoidLinearVelThreshold": "10",
        "DFIntTimestepArbiterHumanoidTurningVelThreshold": "4",
        "DFIntBandwidthManagerDataSenderMaxWorkCatchupMs": "8",
        "DFIntClusterEstimatedCompressionRatioHundredths": "0",
        "DFIntCommonQueuePreserializeParallelBatchSize": "152",
        "DFIntMegaReplicatorNetworkQualityProcessorUnit": "10",
        "DFIntReplicatorVariantKickRateLimitMax": "2147483647",
        "DFIntMemoryUtilityCurveBaseHundrethsPercent": "10000",
        "DFIntTrackCountryRegionAPIHundredthsPercent": "10000",
        "DFIntClusterSenderMaxJoinBandwidthBps": "1205480000",
        "DFIntClientPacketMaxFrameMicroseconds": "1047483647",
        "DFIntNetworkInDeserializeLimitGameplayMsClient": "3",
        "DFIntReplicationVariantKickLimitBytes": "2147483647",
        "DFIntServerBandwidthPlayerSampleRate": "2147465500",
        "DFIntNetworkStreamingGCMaxMicroSecondLimit": "2500",
        "DFIntThirdPartyInMemoryCacheCapacity": "2147483647",
        "DFIntMaxProcessPacketsStepsPerCyclic": "1047483647",
        "DFIntMaxNumReplicatorsToDisconnectPerFrame": "2000",
        "DFIntSimTimestepMultiplierDebounceCount": "521470",
        "DFIntHttpCachePerfHundredthsPercent": "2147483647",
        "DFIntClientNetworkInfluxHundredthsPercentage": "0",
        "DFIntReplicationVariantLimitHundredthPercent": "0",
        "DFIntSignalRHubConnectionConnectTimeoutMs": "2000",
        "DFIntHACDPointSampleDistApartTenths": "2147483647",
        "DFIntDataSenderMaxJoinBandwidthBps": "1205480000",
        "DFIntSimDefaultHumanoidTimestepMultiplier": "125",
        "DFIntHttpCacheCleanScheduleAfterMs": "2147483647",
        "DFIntPerformanceControlFrameTimeMaxUtility": "-1",
        "DFIntNetworkInDeserializeLimitGameplayMsRcc": "3",
        "DFIntDataSenderMaxBandwidthBpsMultiplier": "256",
        "DFIntTimestepArbiterCollidingHumanoidTsm": "125",
        "DFIntMaxWaitTimeBeforeForcePacketProcessMS": "1",
        "DFIntClientPacketHealthyAllocationPercent": "20",
        "DFIntSignalRHubConnectionBaseRetryTimeMs": "100",
        "DFIntAnimationLodFacsVisibilityDenominator": "0",
        "DFIntRakNetApplicationFeedbackMaxSpeedBPS": "0",
        "DFIntRakNetResendMaxThresholdTimeInUs": "50000",
        "DFIntInitialAccelerationLatencyMultTenths": "1",
        "DFIntCSGLevelOfDetailSwitchingDistanceL23": "0",
        "DFIntCSGLevelOfDetailSwitchingDistanceL34": "0",
        "DFIntMemoryUtilityCurveTotalMemoryReserve": "0",
        "DFIntRakNetResendMinThresholdTimeInUs": "5000",
        "DFIntAssetCacheErrorLogHundredthsPercent": "0",
        "DFIntCheckPVCachedRotVelThresholdPercent": "0",
        "DFIntTouchSenderMaxBandwidthBpsScaling": "10",
        "DFIntHttpCachePerfSamplingRate": "2147483647",
        "DFIntNetworkQualityResponderMaxWaitTime": "1",
        "DFIntMaxProcessPacketsJobScaling": "5000000",
        "DFIntMaxProcessPacketsStepsAccumulated": "7",
        "DFIntSignalRCoreKeepAlivePingPeriodMs": "25",
        "DFIntCachedPatchLoadDelayMilliseconds": "1",
        "DFIntGameNetDontSendRedundantNumTimes": "1",
        "DFIntSignalRCoreRpcQueueSize": "2147483647",
        "DFIntSignalRCoreHandshakeTimeoutMs": "3000",
        "DFIntCheckPVCachedVelThresholdPercent": "0",
        "DFIntWaitOnUpdateNetworkLoopEndedMS": "100",
        "DFIntSendGameServerDataMaxLen": "10485760",
        "DFIntMaxDebugNetworkUpdateTimestamps": "5",
        "DFIntLargePacketQueueSizeCutoffMB": "1000",
        "DFIntSignalRHeartbeatIntervalSeconds": "1",
        "DFIntMemoryUtilityCurveNumSegments": "100",
        "DFIntDebugDynamicRenderKiloPixels": "922",
        "DFIntMemCacheMaxCapacityMB": "2147483647",
        "DFIntPerformanceControlFrameTimeMax": "1",
        "DFIntClientPacketExcessMicroseconds": "8",
        "DFIntSignalRCoreServerTimeoutMs": "20000",
        "DFIntNumAssetsMaxToPreload": "2147483647",
        "DFIntBatchThumbnailResultsSizeCap": "200",
        "DFIntBufferDataTotalLimit": "2147483647",
        "DFIntTouchSenderMaxBandwidthBps": "8192",
        "DFIntFileCacheReserveSize": "2147483647",
        "DFIntSignalRCoreHubMaxBackoffMs": "5000",
        "DFIntNetworkSchemaCompressionRatio": "0",
        "DFIntSignalRCoreHubMaxElapsedMs": "1000",
        "DFIntNetworkStreamMinGrowSize": "32768",
        "DFIntNetworkQualityResponderUnit": "10",
        "DFIntSimDesiredVelocityDiffCutoff": "0",
        "DFIntPreloadAvatarAssets": "2147483647",
        "DFIntMaxDataOutJobScaling": "25000000",
        "DFIntSendRakNetStatsInterval": "86400",
        "DFIntClientPacketMinMicroseconds": "1",
        "DFIntSimAdaptiveExtraIterations": "32",
        "DFIntAnimationLodFacsDistanceMax": "0",
        "DFIntAnimationLodFacsDistanceMin": "0",
        "DFIntSignalRCoreHubBaseRetryMs": "10",
        "DFIntHttpBatchApi_cacheDelayMs": "15",
        "DFIntWaitOnRecvFromLoopEndedMS": "10",
        "DFIntMaxDataPacketPerSend": "8000000",
        "DFIntRakNetMinAckGrowthPercent": "0",
        "DFIntRakNetNakResendDelayMsMax": "5",
        "DFIntTaskSchedulerTargetFps": "5000",
        "DFIntCodecMaxIncomingPackets": "100",
        "DFIntCodecMaxOutgoingFrames": "1000",
        "DFIntNetworkStreamInitSize": "8192",
        "DFIntAssetPreloading": "2147483647",
        "DFIntJoinDataCompressionLevel": "0",
        "DFIntMaxAcceptableUpdateDelay": "1",
        "DFIntServerFramesBetweenJoins": "1",
        "DFIntCanHideGuiGroupId": "35503415",
        "DFIntClusterCompressionLevel": "0",
        "DFIntHttpBatchApi_maxWaitMs": "40",
        "DFIntRakNetResendRttMultiple": "1",
        "DFIntClientPacketMaxDelayMs": "1",
        "DFIntBufferCompressionLevel": "0",
        "DFIntHttpBatchApi_minWaitMs": "5",
        "DFIntRakNetNakResendDelayMs": "1",
        "DFIntTextureQualityOverride": "2",
        "DFIntRakNetSelectTimeoutMs": "1",
        "DFIntS2PhysicsSenderRate": "256",
        "DFIntSessionIdlePeriod": "750",
        "DFIntSignalRCoreTimerMs": "50",
        "DFIntRuntimeConcurrency": "3",
        "DFIntMaxFrameBufferSize": "4",
        "DFIntCharacterLoadTime": "1",
        "DFIntDataSenderRate": "240",
        "DFIntSendItemLimit": "512",
        "DFIntEmaHalfLife": "20",
        "DFIntRakNetLoopMs": "1",

        "DFLogClientRecvFromRaknet": "False",
        "DFLogLargeReplicatorTrace": "False",

        "DFStringCrashUploadToBacktraceBaseUrl": "https://localhost/",
        "DFStringHttpPointsReporterUrl": "https://localhost/",
        "DFStringLogUploadToBacktraceSynchronousToken": "",
        "DFStringRobloxAnalyticsURL": "https://localhost/",
        "DFStringTelemetryV2Url": "https://localhost/",
        "DFStringAltTelegrafAddress": "198.51.100.1",
        "DFStringLogUploadToBacktraceToken": "",
        "DFStringTelegrafAddress": "192.0.2.1",
        "DFStringLightstepToken": "",

        "FFlagRenderInstanceClusterRetryPartInvalidationWhenMeshNotReady4": "False",
        "FFlagCLI_146266_GenerationServiceHttpHelperTelemetryUpdate": "False",
        "FFlagEnableSponsoredAdsPerTileTooltipExperienceFooter": "False",
        "FFlagDebugNextGenReplicatorEnabledWriteCFrameColor": "True",
        "FFlagPreComputeAcceleratorArrayForSharingTimeCurve": "True",
        "FFlagEnablePreferredTextSizeStyleFixesInAppShell3": "True",
        "FFlagEnablePreferredTextSizeStyleFixesInAvatarExp": "True",
        "FFlagEnableSponsoredAdsSeeAllGamesListTooltip": "False",
        "FFlagClearCacheableContentProviderOnGameLaunch": "True",
        "FFlagEnablePartyVoiceOnlyForUnfilteredThreads": "False",
        "FFlagEnableSponsoredTooltipForAvatarCatalog2": "False",
        "FFlagEnableSponsoredAdsGameCarouselTooltip3": "False",
        "FFlagCLI_146266_GenerationServiceTelemetry": "False",
        "FFlagUISUseLastFrameTimeInUpdateInputSignal": "True",
        "FFlagEnablePreferredTextSizeSettingInMenus2": "True",
        "FFlagUserCameraControlLastInputTypeUpdate": "False",
        "FFlagDebugDisableTelemetryEphemeralCounter": "True",
        "FFlagEnablePartyVoiceOnlyForEligibleUsers": "False",
        "FFlagEnablePhysicsAdaptiveTimeSteppingIXP": "True",
        "FFlagContentProviderPreloadHangTelemetry": "False",
        "FFlagSimSolverLimitMaxMotorAcceleration": "False",
        "FFlagKeyframeSequenceUseRuntimeSyncPrims": "True",
        "FFlagChatTranslationEnableSystemMessage": "False",
        "FFlagVideoServiceAddHardwareCodecMetrics": "True",
        "FFlagDebugDisableTelemetryEphemeralStat": "True",
        "FFlagRenderLegacyShadowsQualityRefactor": "True",
        "FFlagTaskSchedulerLimitTargetFpsTo2402": "False",
        "FFlagHandleAltEnterFullscreenManually": "False",
        "FFlagEnablePreferredTextSizeGuiService": "True",
        "FFlagAnimationCurveDenseCacheEnabled5": "True",
        "FFlagHumanoidStateUseRuntimeSyncPrims": "True",
        "FFlagDebugDisableTelemetryEventIngest": "True",
        "FFlagUseCachedAudibilityMeasurements": "True",
        "FFlagEnableInGameMenuDurationLogger": "False",
        "FFlagBetaBadgeLearnMoreLinkFormview": "False",
        "FFlagSimStepPhysicsEnableTelemetry": "False",
        "FFlagLargeReplicatorSerializeWrite2": "True",
        "FFlagNextGenReplicatorEnabledWrite4": "True",
        "FFlagDebugDisableTelemetryV2Counter": "True",
        "FFlagNetProcessingFairnessEnabled2": "True",
        "FFlagLargeReplicatorSerializeRead2": "True",
        "FFlagGlobalSettingsEngineModule3": "False",
        "FFlagDebugForceFSMCPULightCulling": "True",
        "FFlagDataModelUseRuntimeSyncPrims": "True",
        "FFlagDebugDisableTelemetryV2Event": "True",
        "FFlagEnablePreferredTextSizeScale": "True",
        "FFlagFixSensitivityTextPrecision": "False",
        "FFlagRenderSkipReadingShaderData": "False",
        "FFlagDebugNextGenRepAttributeRep": "True",
        "FFlagDebugDisableTelemetryV2Stat": "True",
        "FFlagUnifiedLightingBetaFeature": "False",
        "FFlagUserBetterInertialScrolling": "True",
        "FFlagStylingFasterTagProcessing": "True",
        "FFlagDebugDisableTelemetryPoint": "True",
        "FFlagImproveShiftLockTransition": "True",
        "FFlagMessageBusCallOptimization": "True",
        "FFlagPreloadTextureItemsOption4": "True",
        "FFlagLuaAppSponsoredGridTiles": "False",
        "FFlagDebugCheckRenderThreading": "True",
        "FFlagControlBetaBadgeWithGuac": "False",
        "FFlagHighlightOutlinesOnMobile": "True",
        "FFlagEnableTelemetryService1": "False",
        "FFlagEnableTelemetryProtocol": "False",
        "FFlagOptimizeCFrameUpdatesIC3": "True",
        "FFlagDebugGraphicsPreferD3D11": "True",
        "FFlagQuaternionPoseCorrection": "True",
        "FFlagLargeReplicatorEnabled6": "True",
        "FFlagLuaMenuPerfImprovements": "True",
        "FFlagShaderLightingRefactor": "False",
        "FFlagPushFrameTimeToHarmony": "True",
        "FFlagOptimizeCFrameUpdates2": "True",
        "FFlagOptimizeCFrameUpdates4": "True",
        "FFlagSimDcdDeltaReplication": "True",
        "FFlagLoginPageOptimizedPngs": "True",
        "FFlagRenderFixGrassPrepass": "False",
        "FFlagUserShowGuiHideToggles": "True",
        "FFlagLargeReplicatorWrite5": "True",
        "FFlagEnableQuickGameLaunch": "True",
        "FFlagOptimizeCFrameUpdates": "True",
        "FFlagCrashAnalysis146784": "False",
        "FFlagSkipJoinedSessionLog": "True",
        "FFlagLargeReplicatorRead5": "True",
        "FFlagFastGPULightCulling3": "True",
        "FFlagSimDcdRefactorDelta3": "True",
        "FFlagRenderNoLowFrmBloom": "False",
        "FFlagCrashAnalyze142342": "False",
        "FFlagSortKeyOptimization": "True",
        "FFlagNewLightAttenuation": "True",
        "FFlagShoeSkipRenderMesh": "False",
        "FFlagFasterPreciseTime4": "True",
        "FFlagSimDcdEnableDelta2": "True",
        "FFlagAssetPreloadingIXP": "True",
        "FFlagAdServiceEnabled": "False",
        "FFlagSmoothInputOffset": "True",
        "FFlagD3D11SupportBGRA": "True",
        "FFlagMovePrerenderV2": "False",
        "FFlagDebugDisplayFPS": "True",
        "FFlagDebugSSAOForce": "False",
        "FFlagPreloadAllFonts": "True",
        "FFlagVoiceBetaBadge": "False",
        "FFlagMovePrerender": "False",
        "FFlagTextureUseACR3": "True",
        "FFlagAddDMLogging": "False",
        "FFlagDisablePostFx": "True",
        "FFlagFRMRefactor": "False",
        "FFlagLuauCodegen": "True",

        "FIntTaskSchedulerTasksDefaultMaxTimeMsPerCycle": "2147483647",
        "FIntPreferredTextSizeSettingBetaFeatureRolloutPercent": "100",
        "FIntTaskSchedulerTasksDefaultMaxCountPerCycle": "2147483647",
        "FIntFullscreenTitleBarTriggerDelayMillis": "86400000",
        "FIntRenderMaxShadowAtlasUsageBeforeDownscale": "250",
        "FIntSmoothMouseSpringFrequencyTenths": "100",
        "FIntDebugFRMOptionalMSAALevelOverride": "0",
        "FIntDirectionalAttenuationMaxPoints": "100",
        "FIntTextureUseACRHundredthPercent": "10000",
        "FIntGrassMovementReducedMotionFactor": "0",
        "FIntRakNetResendBufferArrayLength": "256",
        "FIntRuntimeMaxNumOfConditions": "1000000",
        "FIntRuntimeMaxNumOfSchedulers": "1000000",
        "FIntRuntimeMaxNumOfSemaphores": "1000000",
        "FIntVertexSmoothingGroupTolerance": "250",
        "FIntRenderMeshOptimizeVertexBuffer": "1",
        "FIntCameraMaxZoomDistance": "2147483647",
        "FIntActivatedCountTimerMSKeyboard": "0",
        "FIntTaskSchedulerAutoThreadLimit": "3",
        "FIntRuntimeMaxNumOfLatches": "1000000",
        "FIntRuntimeMaxNumOfMutexes": "1000000",
        "FIntRuntimeMaxNumOfThreads": "1000000",
        "FIntInterpolationMaxDelayMSec": "100",
        "FIntActivatedCountTimerMSMouse": "0",
        "FIntRenderLocalLightUpdatesMax": "1",
        "FIntRenderLocalLightUpdatesMin": "1",
        "FIntUnifiedLightingBlendZone": "100",
        "FIntRenderGrassDetailStrands": "0",
        "FIntRenderLocalLightFadeInMs": "0",
        "FIntUITextureMaxUpdateDepth": "-1",
        "FIntLuauNormalizeCacheLimit": "0",
        "FIntRefreshRateLowerBound": "60",
        "FIntDebugForceMSAASamples": "0",
        "FIntRenderShadowIntensity": "0",
        "FIntTerrainArraySliceSize": "0",
        "FIntRuntimeMaxNumOfDPCs": "64",
        "FIntFRMMaxGrassDistance": "0",
        "FIntFRMMinGrassDistance": "0",
        "FIntRenderShadowmapBias": "0",
        "FIntTargetRefreshRate": "60",
        "FIntDefaultJitterN": "0",
        "FIntSSAOMipLevels": "0",
        "FIntCLI20390_2": "1",
        "FIntSSAO": "0",

        "FLogBackendAdsProviderLog": "False",

        "FStringCoreScriptBacktraceErrorUploadToken": "xxx",
        "FStringVoiceBetaBadgeLearnMoreLink": "null",
        "FStringGetPlayerImageDefaultTimeout": "1",
        "FStringTerrainMaterialTablePre2022": "",
        "FStringTerrainMaterialTable2022": "",
        "FStringTencentAuthPath": "xxx"
      },
      null,
      2
    ),
    category: "performance",
    difficulty: "experimental",
    compatibility: ["Roblox"],
  },
  {
    id: "preset-4",
    title: "Stoof's Optimal + 5070's Low Latency",
    description: "Basic optimization and low latency settings. (i use ts)",
    content: JSON.stringify(
      {
        "FLogNetwork": "7",
        "FFlagHandleAltEnterFullscreenManually": "False",
        "FStringDebugLuaLogPattern": "ExpChat/mountClientApp",
        "FStringDebugLuaLogLevel": "trace",
        "FFlagEnableInGameMenuChrome": "True",
        "DFFlagDisableDPIScale": "True",
        "FFlagDisableNewIGMinDUA": "True",
        "FFlagEnableInGameMenuControls": "True",
        "FFlagEnableInGameMenuModernization": "True",
        "FFlagEnableMenuControlsABTest": "False",
        "FFlagEnableV3MenuABTest3": "False",
        "FFlagFixGraphicsQuality": "True",
        "FIntFullscreenTitleBarTriggerDelayMillis": "3600000",
        "FIntRenderShadowIntensity": "0",
        "DFIntMaxFrameBufferSize": "4",
        "FFlagSimEnableDCD10": "True",
        "DFIntBufferCompressionLevel": "0",
        "DFIntBufferCompressionThreshold": "100",
        "DFIntPerformanceControlFrameTimeMax": "1",
        "DFIntPerformanceControlFrameTimeMaxUtility": "-1",
        "FFlagPushFrameTimeToHarmony": "True",
        "FFlagUISUseLastFrameTimeInUpdateInputSignal": "True",
        "DFIntAnimatorThrottleMaxFramesToSkip": "1",
        "DFIntNumFramesAllowedToBeAboveError": "1",
        "DFIntVisibilityCheckRayCastLimitPerFrame": "10",
        "DFIntNetworkSchemaCompressionRatio": "0",
        "DFIntTimeBetweenSendConnectionAttemptsMS": "200",
        "FFlagFastGPULightCulling3": "True",
        "FFlagDebugCheckRenderThreading": "True",
        "FFlagRenderDebugCheckThreading2": "True",
        "FFlagDebugGraphicsPreferD3D11": "True",
        "DFFlagDebugDisableTimeoutDisconnect": "True",
        "FFlagDebugDisableTelemetryEphemeralCounter": "True",
        "FFlagDebugDisableTelemetryEphemeralStat": "True",
        "FFlagDebugDisableTelemetryEventIngest": "True",
        "FFlagDebugDisableTelemetryV2Counter": "True",
        "FFlagDebugDisableTelemetryV2Event": "True",
        "FFlagDebugDisableTelemetryV2Stat": "True",
        "FFlagAlwaysShowVRToggleV3": "False",
        "FFlagDisableFeedbackSoothsayerCheck": "False",
        "FFlagAddHapticsToggle": "False",
        "DFIntVoiceChatVolumeThousandths": "8600",
        "DFFlagCollectAudioPluginTelemetry": "False",
        "DFFlagDSTelemetryV2ReplaceSeparator": "False",
        "DFFlagDebugPerfMode": "True",
        "DFFlagEmitSafetyTelemetryInCallbackEnable": "False",
        "DFFlagEnableFmodErrorsTelemetry": "False",
        "DFFlagEnablePreloadAvatarAssets": "True",
        "DFFlagEnableSkipUpdatingGlobalTelemetryInfo2": "False",
        "DFFlagEnableSoundPreloading": "True",
        "DFFlagEnableTelemetryV2FRMStats": "False",
        "DFFlagEnableTexturePreloading": "True",
        "DFFlagGpuVsCpuBoundTelemetry": "False",
        "DFFlagGraphicsQualityUsageTelemetry": "False",
        "DFFlagRccLoadSoundLengthTelemetryEnabled": "False",
        "DFFlagRemoveTelemetryFlushOnJobClose": "False",
        "DFFlagReportAssetRequestV1Telemetry": "False",
        "DFFlagReportRenderDistanceTelemetry": "False",
        "DFFlagRobloxTelemetryAddDeviceRAM": "False",
        "DFFlagRobloxTelemetryAddDeviceRAMPointsV2": "False",
        "DFFlagRobloxTelemetryV2PointEncoding": "False",
        "DFFlagSampleAndRefreshRakPing": "True",
        "DFFlagSendRenderFidelityTelemetry": "False",
        "DFFlagSimOptimizeSetSize": "True",
        "DFFlagSimSolverSendPerfTelemetryToElasticSearch2": "False",
        "DFFlagTaskSchedulerAvoidSleep": "True",
        "DFFlagTeleportClientAssetPreloadingDoingExperiment": "True",
        "DFFlagTeleportClientAssetPreloadingDoingExperiment2": "True",
        "DFFlagTeleportClientAssetPreloadingEnabledIXP": "True",
        "DFFlagTeleportClientAssetPreloadingEnabledIXP2": "True",
        "DFIntAssetPreloading": "2147483647",
        "DFIntCanHideGuiGroupId": "32380007",
        "DFIntCharacterLoadTime": "1",
        "DFIntContentProviderPreloadHangTelemetryHundredthsPercentage": "0",
        "DFIntMemoryUtilityCurveBaseHundrethsPercent": "10000",
        "DFIntMemoryUtilityCurveNumSegments": "100",
        "DFIntMemoryUtilityCurveTotalMemoryReserve": "0",
        "DFIntNumAssetsMaxToPreload": "2147483647",
        "DFIntPreloadAvatarAssets": "2147483647",
        "DFIntS2PhysicsSenderRate": "256",
        "DFIntSignalRCoreHandshakeTimeoutMs": "5000",
        "DFIntSignalRCoreHubBaseRetryMs": "200",
        "DFIntSignalRCoreHubMaxBackoffMs": "100",
        "DFIntSignalRCoreKeepAlivePingPeriodMs": "250",
        "DFIntSignalRCoreRpcQueueSize": "4096",
        "DFIntSignalRCoreServerTimeoutMs": "11100",
        "DFIntTaskSchedulerTargetFps": "240",
        "DFIntTeleportClientAssetPreloadingHundredthsPercentage": "100000",
        "DFIntTeleportClientAssetPreloadingHundredthsPercentage2": "100000",
        "DFIntTrackCountryRegionAPIHundredthsPercent": "10000",
        "FFlagAddDMLogging": "False",
        "FFlagAssetPreloadingIXP": "True",
        "FFlagBetaBadgeLearnMoreLinkFormview": "False",
        "FFlagChatTranslationEnableSystemMessage": "False",
        "FFlagContentProviderPreloadHangTelemetry": "False",
        "FFlagControlBetaBadgeWithGuac": "False",
        "FFlagDebugDisableTelemetryPoint": "True",
        "FFlagDebugForceFSMCPULightCulling": "True",
        "FFlagEnablePartyVoiceOnlyForEligibleUsers": "False",
        "FFlagEnablePartyVoiceOnlyForUnfilteredThreads": "False",
        "FFlagEnablePreferredTextSizeGuiService": "True",
        "FFlagEnablePreferredTextSizeScale": "True",
        "FFlagEnablePreferredTextSizeSettingInMenus2": "True",
        "FFlagEnablePreferredTextSizeStyleFixesInAppShell3": "True",
        "FFlagEnablePreferredTextSizeStyleFixesInAvatarExp": "True",
        "FFlagFixSensitivityTextPrecision": "False",
        "FFlagHighlightOutlinesOnMobile": "True",
        "FFlagImproveShiftLockTransition": "True",
        "FFlagLoginPageOptimizedPngs": "True",
        "FFlagLuauCodegen": "True",
        "FFlagMessageBusCallOptimization": "True",
        "FFlagPreloadAllFonts": "True",
        "FFlagPreloadTextureItemsOption4": "True",
        "FFlagQuaternionPoseCorrection": "True",
        "FFlagRenderCBRefactor2": "True",
        "FFlagRenderLegacyShadowsQualityRefactor": "True",
        "FFlagRenderSkipReadingShaderData": "False",
        "FFlagShoeSkipRenderMesh": "False",
        "FFlagTaskSchedulerLimitTargetFpsTo2402": "False",
        "FFlagUserBetterInertialScrolling": "True",
        "FFlagUserCameraControlLastInputTypeUpdate": "False",
        "FFlagUserShowGuiHideToggles": "True",
        "FFlagVideoServiceAddHardwareCodecMetrics": "True",
        "FFlagVoiceBetaBadge": "False",
        "FIntCLI20390_2": "1",
        "FIntCameraMaxZoomDistance": "2147483647",
        "FIntPreferredTextSizeSettingBetaFeatureRolloutPercent": "100",
        "FStringGetPlayerImageDefaultTimeout": "1",
        "FStringTencentAuthPath": "null",
        "FStringVoiceBetaBadgeLearnMoreLink": "null",
        "DFFlagUpdateBoundExtentsForHugeMixedReplicationComponents": "True",
        "DFFlagSimAdaptiveExplicitlyMarkInterpolatedAssemblies": "True",
        "DFFlagAcceleratorUpdateOnPropsAndValueTimeChange": "True",
        "DFFlagReplicatorCheckReadTableCollisions": "True",
        "DFFlagReplicatorSeparateVarThresholds": "True",
        "DFFlagDebugPVLOD0SerializeFullMatrix": "True",
        "DFFlagSimSmoothedRunningController2": "True",
        "DFFlagClampIncomingReplicationLag": "True",
        "DFFlagHumanoidReplicateSimulated2": "True",
        "DFFlagSolverStateReplicatedOnly2": "True",
        "DFFlagReplicateCreateToPlayer": "True",
        "DFFlagMergeFakeInputEvents3": "True",
        "FFlagDebugNextGenReplicatorEnabledWriteCFrameColor": "True",
        "FFlagPreComputeAcceleratorArrayForSharingTimeCurve": "True",
        "FFlagKeyframeSequenceUseRuntimeSyncPrims": "True",
        "FFlagAnimationCurveDenseCacheEnabled5": "True",
        "FFlagHumanoidStateUseRuntimeSyncPrims": "True",
        "FFlagNextGenReplicatorEnabledWrite4": "True",
        "FFlagDataModelUseRuntimeSyncPrims": "True",
        "FFlagDebugNextGenRepAttributeRep": "True",
        "FFlagOptimizeCFrameUpdatesIC3": "True",
        "FFlagLuaMenuPerfImprovements": "True",
        "FFlagOptimizeCFrameUpdates4": "True",
        "FFlagSimDcdDeltaReplication": "True",
        "FFlagSimDcdRefactorDelta3": "True",
        "FFlagSortKeyOptimization": "True",
        "FFlagFasterPreciseTime4": "True",
        "FFlagSimDcdEnableDelta2": "True",
        "FFlagSmoothInputOffset": "True",
        "FFlagEnableInGameMenuDurationLogger": "False",
        "FFlagMovePrerenderV2": "False",
        "FFlagMovePrerender": "False",
        "DFIntCheckPVDifferencesForInterpolationMinRotVelThresholdRadsPerSecHundredth": "0",
        "DFIntCheckPVDifferencesForInterpolationMinVelThresholdStudsPerSecHundredth": "0",
        "DFIntCheckPVLinearVelocityIntegrateVsDeltaPositionThresholdPercent": "1",
        "DFIntGameNetPVHeaderRotationOrientIdToleranceExponent": "-2147483648",
        "DFIntGameNetPVHeaderRotationalVelocityZeroCutoffExponent": "-5000",
        "DFIntSignalRCoreHubConnectionDisconnectInfoHundredthsPercent": "5",
        "DFIntHumanoidStateChangeEventIngestThrottleHundrethsPercent": "0",
        "DFIntRakNetApplicationFeedbackScaleUpFactorHundredthPercent": "0",
        "DFIntGameNetPVHeaderLinearVelocityZeroCutoffExponent": "-5000",
        "DFIntInterpolationFrameRotVelocityThresholdMillionth": "100",
        "DFIntGameNetPVHeaderTranslationZeroCutoffExponent": "-5000",
        "DFIntIncorrectlyPausedReplicationHundredthsPercentage": "0",
        "DFIntRakNetApplicationFeedbackScaleUpThresholdPercent": "0",
        "DFIntGameNetDontSendRedundantDeltaThresholdMillionth": "0",
        "DFIntGameNetDontSendRedundantDeltaPositionMillionth": "0",
        "DFIntInterpolationFramePositionThresholdMillionth": "100",
        "DFIntJoinDataItemEstimatedCompressionRatioHundreths": "0",
        "DFIntGraphicsOptimizationModeMaxFrameTimeTargetMs": "25",
        "DFIntReplicatorCountLimitInfluxHundrethsPercentage": "0",
        "DFIntReplicatorVariantContainerCountLimit": "2147483647",
        "DFIntMaxReceiveToDeserializeLatencyMilliseconds": "10",
        "DFIntSignalRHubConnectionHeartbeatTimerRateMs": "1000",
        "DFIntClusterEstimatedCompressionRatioHundredths": "0",
        "DFIntCommonQueuePreserializeParallelBatchSize": "152",
        "DFIntMegaReplicatorNetworkQualityProcessorUnit": "10",
        "DFIntReplicatorVariantKickRateLimitMax": "2147483647",
        "DFIntNetworkInDeserializeLimitGameplayMsClient": "3",
        "DFIntReplicationVariantKickLimitBytes": "2147483647",
        "DFIntMaxNumReplicatorsToDisconnectPerFrame": "2000",
        "DFIntClientNetworkInfluxHundredthsPercentage": "0",
        "DFIntReplicationVariantLimitHundredthPercent": "0",
        "DFIntSignalRHubConnectionConnectTimeoutMs": "2000",
        "DFIntNetworkInDeserializeLimitGameplayMsRcc": "3",
        "DFIntClientPacketHealthyAllocationPercent": "20",
        "DFIntSignalRHubConnectionBaseRetryTimeMs": "100",
        "DFIntInitialAccelerationLatencyMultTenths": "1",
        "DFIntCheckPVCachedRotVelThresholdPercent": "0",
        "DFIntClientPacketMaxFrameMicroseconds": "200",
        "DFIntMaxProcessPacketsStepsPerCyclic": "5000",
        "DFIntNetworkQualityResponderMaxWaitTime": "1",
        "DFIntClientPacketExcessMicroseconds": "1000",
        "DFIntMaxProcessPacketsStepsAccumulated": "0",
        "DFIntCheckPVCachedVelThresholdPercent": "0",
        "DFIntGameNetDontSendRedundantNumTimes": "0",
        "DFIntWaitOnUpdateNetworkLoopEndedMS": "100",
        "DFIntLargePacketQueueSizeCutoffMB": "1000",
        "DFIntMaxProcessPacketsJobScaling": "10000",
        "DFIntSignalRHeartbeatIntervalSeconds": "1",
        "DFIntBatchThumbnailResultsSizeCap": "200",
        "DFIntMaxDataPacketPerSend": "2147483647",
        "DFIntSignalRCoreHubMaxElapsedMs": "1000",
        "DFIntNetworkQualityResponderUnit": "10",
        "DFIntSimDesiredVelocityDiffCutoff": "0",
        "DFIntSimAdaptiveExtraIterations": "32",
        "DFIntHttpBatchApi_cacheDelayMs": "15",
        "DFIntWaitOnRecvFromLoopEndedMS": "10",
        "DFIntCodecMaxIncomingPackets": "100",
        "DFIntCodecMaxOutgoingFrames": "1000",
        "DFIntJoinDataCompressionLevel": "0",
        "DFIntMaxAcceptableUpdateDelay": "1",
        "DFIntServerFramesBetweenJoins": "1",
        "DFIntHttpBatchApi_maxWaitMs": "40",
        "DFIntRakNetResendRttMultiple": "1",
        "DFIntClientPacketMaxDelayMs": "1",
        "DFIntHttpBatchApi_minWaitMs": "5",
        "DFIntRakNetNakResendDelayMs": "1",
        "DFIntRakNetSelectTimeoutMs": "1",
        "DFIntSignalRCoreTimerMs": "50",
        "DFIntRakNetLoopMs": "1",
        "FIntSmoothMouseSpringFrequencyTenths": "100",
        "FIntRuntimeMaxNumOfConditions": "1000000",
        "FIntRuntimeMaxNumOfSchedulers": "1000000",
        "FIntRuntimeMaxNumOfSemaphores": "1000000",
        "FIntRuntimeMaxNumOfLatches": "1000000",
        "FIntRuntimeMaxNumOfMutexes": "1000000",
        "FIntRuntimeMaxNumOfThreads": "1000000",
        "FIntInterpolationMaxDelayMSec": "100",
        "FIntRuntimeMaxNumOfDPCs": "64",
        "FIntDefaultJitterN": "0"
      },
      null,
      2
    ),
    category: "performance",
    difficulty: "safe",
    compatibility: ["Roblox", "Roblox Studio", "Roblox Mobile"],
  },
  {
    id: "preset-5",
    title: "Stoof's Lossless",
    description: "Lossless graphics settings.",
    content: JSON.stringify(
      {
        "DFFlagAcceleratorUpdateOnPropsAndValueTimeChange": "True",
        "DFFlagAudioEnableVolumetricPanningForMeshes": "True",
        "DFFlagAudioEnableVolumetricPanningForPolys": "True",
        "DFFlagAudioUseVolumetricPanning": "True",
        "DFFlagClampIncomingReplicationLag": "True",
        "DFFlagCollectAudioPluginTelemetry": "False",
        "DFFlagDSTelemetryV2ReplaceSeparator": "False",
        "DFFlagDebugOverrideDPIScale": "True",
        "DFFlagDebugRenderForceTechnologyVoxel": "False",
        "DFFlagDisableDPIScale": "True",
        "DFFlagEmitSafetyTelemetryInCallbackEnable": "False",
        "DFFlagEnableFmodErrorsTelemetry": "False",
        "DFFlagEnablePreloadAvatarAssets": "True",
        "DFFlagEnableSkipUpdatingGlobalTelemetryInfo2": "False",
        "DFFlagEnableSoundPreloading": "True",
        "DFFlagEnableTelemetryV2FRMStats": "False",
        "DFFlagEnableTexturePreloading": "True",
        "DFFlagFixMeshScale2": "True",
        "DFFlagFixSkyBoxTextureBlurrines": "True",
        "DFFlagGpuVsCpuBoundTelemetry": "False",
        "DFFlagGraphicsQualityUsageTelemetry": "False",
        "DFFlagHumanoidReplicateSimulated2": "True",
        "DFFlagHumanoidReplicateSimulated2TurnOffLocalState": "True",
        "DFFlagMergeFakeInputEvents3": "True",
        "DFFlagRakNetEnablePoll": "True",
        "DFFlagRakNetFixBwCollapse": "True",
        "DFFlagRccLoadSoundLengthTelemetryEnabled": "False",
        "DFFlagRemoveTelemetryFlushOnJobClose": "False",
        "DFFlagRenderLanczosSeparateAxis2": "True",
        "DFFlagRenderLanczosUpsampling2": "True",
        "DFFlagRenderLanczosUpsamplingNonRinging2": "True",
        "DFFlagRenderSmootherStepUpsampling": "True",
        "DFFlagReplicateCreateToPlayer": "True",
        "DFFlagReplicatorCheckReadTableCollisions": "True",
        "DFFlagReplicatorDisKickSize": "True",
        "DFFlagReplicatorSeparateVarThresholds": "True",
        "DFFlagReportAssetRequestV1Telemetry": "False",
        "DFFlagReportRenderDistanceTelemetry": "False",
        "DFFlagRobloxTelemetryAddDeviceRAM": "False",
        "DFFlagRobloxTelemetryAddDeviceRAMPointsV2": "False",
        "DFFlagRobloxTelemetryV2PointEncoding": "False",
        "DFFlagSampleAndRefreshRakPing": "True",
        "DFFlagSendRenderFidelityTelemetry": "False",
        "DFFlagSimAdaptiveExplicitlyMarkInterpolatedAssemblies": "True",
        "DFFlagSimDcdRefactorSetPhysics": "True",
        "DFFlagSimGroundControllerIgnoreYVelocityInit": "False",
        "DFFlagSimOptimizeGeometryChangedAssemblies3": "True",
        "DFFlagSimOptimizeSetSize": "True",
        "DFFlagSimSmoothedRunningController2": "True",
        "DFFlagSimSolverSendPerfTelemetryToElasticSearch2": "False",
        "DFFlagSolverStateReplicatedOnly2": "True",
        "DFFlagTaskSchedulerAvoidSleep": "True",
        "DFFlagTeleportClientAssetPreloadingDoingExperiment": "True",
        "DFFlagTeleportClientAssetPreloadingDoingExperiment2": "True",
        "DFFlagTeleportClientAssetPreloadingEnabledIXP": "True",
        "DFFlagTeleportClientAssetPreloadingEnabledIXP2": "True",
        "DFFlagTextureQualityOverrideEnabled": "True",
        "DFFlagUpdateBoundExtentsForHugeMixedReplicationComponents": "True",
        "DFIntAnimationLodFacsFpsMax": "2147483647",
        "DFIntAnimationLodFacsFpsMin": "2147483647",
        "DFIntAssetPreloading": "2147483647",
        "DFIntAudioOcclusionMaxNumQueriesPerFrame": "6",
        "DFIntAudioOcclusionMaxPiercedPrimitives": "6",
        "DFIntAudioOcclusionUpdateRateMs": "2",
        "DFIntBandwidthManagerApplicationDefaultBps": "64000",
        "DFIntBandwidthManagerDataSenderMaxWorkCatchupMs": "20",
        "DFIntBatchThumbnailResultsSizeCap": "200",
        "DFIntBufferCompressionLevel": "0",
        "DFIntCSGLevelOfDetailSwitchingDistance": "2147483647",
        "DFIntCSGLevelOfDetailSwitchingDistanceL12": "2147483647",
        "DFIntCSGLevelOfDetailSwitchingDistanceL23": "2147483647",
        "DFIntCSGLevelOfDetailSwitchingDistanceL34": "2147483647",
        "DFIntCanHideGuiGroupId": "32380007",
        "DFIntCharacterLoadTime": "1",
        "DFIntCheckPVDifferencesForInterpolationMinVelThresholdStudsPerSecHundredth": "1",
        "DFIntCheckPVLinearVelocityIntegrateVsDeltaPositionThresholdPercent": "1",
        "DFIntCliMaxPayloadRcv": "2147483647",
        "DFIntCliMaxPayloadSnd": "2147483647",
        "DFIntCliTcMaxPayloadRcv": "2147483647",
        "DFIntCliTcMaxPayloadSnd": "2147483647",
        "DFIntClientNetworkInfluxHundredthsPercentage": "0",
        "DFIntClientPacketExcessMicroseconds": "1000",
        "DFIntClientPacketHealthyAllocationPercent": "20",
        "DFIntClientPacketMaxDelayMs": "1",
        "DFIntClientPacketMaxFrameMicroseconds": "200",
        "DFIntClusterEstimatedCompressionRatioHundredths": "0",
        "DFIntCodecMaxIncomingPackets": "100",
        "DFIntCodecMaxOutgoingFrames": "1000",
        "DFIntConnectionMTUSize": "1472",
        "DFIntContentProviderPreloadHangTelemetryHundredthsPercentage": "0",
        "DFIntDebugDynamicRenderKiloPixels": "2147483647",
        "DFIntDebugFRMQualityLevelOverride": "21",
        "DFIntDebugPerformanceControlFrameTime": "2",
        "DFIntDebugRestrictGCDistance": "16",
        "DFIntFrameRateMSToReduceTouchEvents": "30",
        "DFIntGameNetDontSendRedundantDeltaPositionMillionth": "0",
        "DFIntGameNetDontSendRedundantDeltaThresholdMillionth": "0",
        "DFIntGameNetDontSendRedundantNumTimes": "0",
        "DFIntGameNetPVHeaderLinearVelocityZeroCutoffExponent": "-1",
        "DFIntGameNetPVHeaderRotationOrientIdToleranceExponent": "-2147483648",
        "DFIntGameNetPVHeaderRotationalVelocityZeroCutoffExponent": "-1",
        "DFIntGameNetPVHeaderTranslationZeroCutoffExponent": "-1",
        "DFIntGraphicsOptimizationModeMaxFrameTimeTargetMs": "2",
        "DFIntGraphicsOptimizationModeMinFrameTimeTargetMs": "1",
        "DFIntHACDPointSampleDistApartTenths": "-2147483647",
        "DFIntHttpBatchApi_cacheDelayMs": "15",
        "DFIntHttpBatchApi_maxWaitMs": "40",
        "DFIntHttpBatchApi_minWaitMs": "5",
        "DFIntHumanoidStateChangeEventIngestThrottleHundrethsPercent": "0",
        "DFIntIncorrectlyPausedReplicationHundredthsPercentage": "0",
        "DFIntInitialAccelerationLatencyMultTenths": "1",
        "DFIntInterpolationFramePositionThresholdMillionth": "100",
        "DFIntInterpolationFrameRotVelocityThresholdMillionth": "100",
        "DFIntInterpolationFrameVelocityThresholdMillionth": "10",
        "DFIntJoinDataCompressionLevel": "0",
        "DFIntJoinDataItemEstimatedCompressionRatioHundreths": "0",
        "DFIntLargePacketQueueSizeCutoffMB": "1000",
        "DFIntMaxAcceptableUpdateDelay": "1",
        "DFIntMaxAverageFrameDelayExceedFactor": "2",
        "DFIntMaxDataPacketPerSend": "2147483647",
        "DFIntMaxFrameBufferSize": "4",
        "DFIntMaxNumReplicatorsToDisconnectPerFrame": "2000",
        "DFIntMaxProcessPacketsJobScaling": "10000",
        "DFIntMaxProcessPacketsStepsAccumulated": "0",
        "DFIntMaxProcessPacketsStepsPerCyclic": "5000",
        "DFIntMaxReceiveToDeserializeLatencyMilliseconds": "10",
        "DFIntMegaReplicatorNetworkQualityProcessorUnit": "10",
        "DFIntMegaReplicatorNumParallelTasks": "16",
        "DFIntNetworkClusterPacketCacheNumParallelTasks": "16",
        "DFIntNetworkInDeserializeLimitGameplayMsClient": "3",
        "DFIntNetworkInDeserializeLimitGameplayMsRcc": "3",
        "DFIntNetworkInProcessLimitGameplayMsClient": "0",
        "DFIntNetworkQualityResponderMaxWaitTime": "1",
        "DFIntNetworkQualityResponderUnit": "10",
        "DFIntNetworkSchemaCompressionRatio": "0",
        "DFIntNumAssetsMaxToPreload": "2147483647",
        "DFIntOcclusionFresnelConsensusNumerator": "2",
        "DFIntOcclusionFresnelEllipsoids": "6",
        "DFIntOcclusionGainScalarNumerator": "2",
        "DFIntOcclusionShelfScalarNumerator": "2",
        "DFIntPerformanceControlFrameTimeMax": "1",
        "DFIntPerformanceControlFrameTimeMaxUtility": "-1",
        "DFIntPerformanceControlReportingPeriodInMs": "700",
        "DFIntPerformanceControlTextureQualityBestUtility": "2147483647",
        "DFIntPreloadAvatarAssets": "2147483647",
        "DFIntRakNetApplicationFeedbackScaleUpFactorHundredthPercent": "0",
        "DFIntRakNetApplicationFeedbackScaleUpThresholdPercent": "0",
        "DFIntRakNetLoopMs": "1",
        "DFIntRakNetMtuValue1InBytes": "1492",
        "DFIntRakNetMtuValue2InBytes": "1516",
        "DFIntRakNetMtuValue3InBytes": "1516",
        "DFIntRakNetNakResendDelayMs": "1",
        "DFIntRakNetResendRttMultiple": "1",
        "DFIntRakNetSelectTimeoutMs": "1",
        "DFIntRaycastMaxDistance": "2147483647",
        "DFIntRccMaxPayloadRcv": "2147483647",
        "DFIntRccMaxPayloadSnd": "2147483647",
        "DFIntRccTcMaxPayloadRcv": "2147483647",
        "DFIntRccTcMaxPayloadSnd": "2147483647",
        "DFIntReplicationDataCacheNumParallelTasks": "16",
        "DFIntReplicationVariantKickLimitBytes": "2147483647",
        "DFIntReplicationVariantLimitHundredthPercent": "0",
        "DFIntReplicatorCountLimitInfluxHundrethsPercentage": "0",
        "DFIntReplicatorVariantContainerCountLimit": "2147483647",
        "DFIntReplicatorVariantKickRateLimitMax": "2147483647",
        "DFIntRuntimeConcurrency": "16",
        "DFIntS2PhysicsSenderRate": "38760",
        "DFIntServerFramesBetweenJoins": "1",
        "DFIntSignalRCoreHandshakeTimeoutMs": "3000",
        "DFIntSignalRCoreHubBaseRetryMs": "10",
        "DFIntSignalRCoreHubMaxBackoffMs": "5000",
        "DFIntSignalRCoreKeepAlivePingPeriodMs": "25",
        "DFIntSignalRCoreRpcQueueSize": "2147483647",
        "DFIntSignalRCoreServerTimeoutMs": "20000",
        "DFIntSimAdaptiveExtraIterations": "32",
        "DFIntSimAdaptiveHumanoidPDControllerSubstepMultiplier": "1000",
        "DFIntSimDesiredVelocityDiffCutoff": "0",
        "DFIntSoundVelocitySmoothingNewRatio": "2",
        "DFIntSoundVelocitySmoothingOldRatio": "5",
        "DFIntTargetTimeDelayFacctorTenths": "15",
        "DFIntTaskSchedulerJobInGameThreads": "16",
        "DFIntTaskSchedulerJobInitThreads": "16",
        "DFIntTaskSchedulerTargetFps": "240",
        "DFIntTeleportClientAssetPreloadingHundredthsPercentage": "100000",
        "DFIntTeleportClientAssetPreloadingHundredthsPercentage2": "1000",
        "DFIntTextureQualityOverride": "3",
        "DFIntTimestepArbiterHumanoidLinearVelThreshold": "1",
        "DFIntTimestepArbiterHumanoidTurningVelThreshold": "1",
        "DFIntTrackCountryRegionAPIHundredthsPercent": "10000",
        "DFIntVideoEncoderBitrate": "2147483647",
        "DFIntWaitOnRecvFromLoopEndedMS": "10",
        "DFIntWaitOnUpdateNetworkLoopEndedMS": "100",
        "FFlagAdServiceEnabled": "False",
        "FFlagAddDMLogging": "False",
        "FFlagAnimationCurveDenseCacheEnabled3": "True",
        "FFlagAssetPreloadingIXP": "True",
        "FFlagBetaBadgeLearnMoreLinkFormview": "False",
        "FFlagCSG4StudioBetaFeature": "True",
        "FFlagCanReplicateContentPropertiesServer": "True",
        "FFlagChatTranslationEnableSystemMessage": "False",
        "FFlagContentProviderPreloadHangTelemetry": "False",
        "FFlagControlBetaBadgeWithGuac": "False",
        "FFlagDebugCheckRenderThreading": "True",
        "FFlagDebugDisableTelemetryEphemeralCounter": "True",
        "FFlagDebugDisableTelemetryEphemeralStat": "True",
        "FFlagDebugDisableTelemetryEventIngest": "True",
        "FFlagDebugDisableTelemetryPoint": "True",
        "FFlagDebugDisableTelemetryV2Counter": "True",
        "FFlagDebugDisableTelemetryV2Event": "True",
        "FFlagDebugDisableTelemetryV2Stat": "True",
        "FFlagDebugEnableDirectAudioOcclusion2": "True",
        "FFlagDebugForceFutureIsBrightPhase2": "False",
        "FFlagDebugForceFutureIsBrightPhase3": "True",
        "FFlagDebugGraphicsPreferD3D11": "True",
        "FFlagDebugGridForceFractalUpsample": "True",
        "FFlagDebugNextGenRepAttributeRep": "True",
        "FFlagDebugNextGenReplicatorEnabledWriteCFrameColor": "True",
        "FFlagDebugRenderCollectGpuCounters": "True",
        "FFlagDebugSSAOForce": "True",
        "FFlagEnablePartyVoiceOnlyForEligibleUsers": "False",
        "FFlagEnablePartyVoiceOnlyForUnfilteredThreads": "False",
        "FFlagEnablePreferredTextSizeGuiService": "True",
        "FFlagEnablePreferredTextSizeScale": "True",
        "FFlagEnablePreferredTextSizeSettingInMenus2": "True",
        "FFlagEnablePreferredTextSizeStyleFixesInAppShell3": "True",
        "FFlagEnablePreferredTextSizeStyleFixesInAvatarExp": "True",
        "FFlagEnableZstdForClientSettings": "False",
        "FFlagFasterPreciseTime4": "True",
        "FFlagFixSensitivityTextPrecision": "False",
        "FFlagFixTextureCompositorFramebufferManagement2": "True",
        "FFlagHandleAltEnterFullscreenManually": "False",
        "FFlagHighlightOutlinesOnMobile": "True",
        "FFlagHumanoidStateUseRuntimeSyncPrims": "True",
        "FFlagImproveShiftLockTransition": "True",
        "FFlagKeyframeSequenceUseRuntimeSyncPrims": "True",
        "FFlagLargeReplicatorEnabled5": "True",
        "FFlagLargeReplicatorRead3": "True",
        "FFlagLargeReplicatorWrite3": "True",
        "FFlagLoginPageOptimizedPngs": "True",
        "FFlagLuauCodegen": "True",
        "FFlagMessageBusCallOptimization": "True",
        "FFlagMovePrerenderV2": "False",
        "FFlagNetworkSchemaVersionClientBit": "True",
        "FFlagNetworkSchemaVersionServerBit": "True",
        "FFlagNewCSGAPIBetaFeature": "True",
        "FFlagNewCameraControls_SpeedAdjustEnum": "False",
        "FFlagPreComputeAcceleratorArrayForSharingTimeCurve": "True",
        "FFlagPreloadAllFonts": "True",
        "FFlagPreloadTextureItemsOption4": "True",
        "FFlagQuaternionPoseCorrection": "True",
        "FFlagRealTimeAnimationEnableRefactor": "True",
        "FFlagRemovedRbxRenderingPreProcessor": "True",
        "FFlagRenderCBRefactor2": "True",
        "FFlagRenderDynamicResolutionScale12": "False",
        "FFlagRenderEnableIGCounters": "False",
        "FFlagRenderInitShadowmaps": "True",
        "FFlagRenderLegacyShadowsQualityRefactor": "True",
        "FFlagRenderUnifiedLighting12": "True",
        "FFlagReportGpuLimitedToPerfControl": "False",
        "FFlagSimCSG4EnableMesh": "True",
        "FFlagSimDcdEnableDelta2": "True",
        "FFlagSimDcdRefactorDelta3": "True",
        "FFlagSortKeyOptimization": "True",
        "FFlagSoundsUsePhysicalVelocity": "True",
        "FFlagTaskSchedulerLimitTargetFpsTo2402": "False",
        "FFlagUserBetterInertialScrolling": "True",
        "FFlagUserCameraControlLastInputTypeUpdate": "False",
        "FFlagUserShowGuiHideToggles": "True",
        "FFlagUserSoundsUseRelativeVelocity2": "True",
        "FFlagVideoServiceAddHardwareCodecMetrics": "True",
        "FFlagVoiceBetaBadge": "False",
        "FIntActivatedCountTimerMSKeyboard": "0",
        "FIntActivatedCountTimerMSMouse": "0",
        "FIntCLI20390_2": "1",
        "FIntCameraFarZPlane": "2147483647",
        "FIntCameraMaxZoomDistance": "2147483647",
        "FIntDebugForceMSAASamples": "8",
        "FIntDefaultJitterN": "0",
        "FIntDirectionalAttenuationMaxPoints": "2147483647",
        "FIntEnableCullableScene2HundredthPercent3": "1000",
        "FIntFullscreenTitleBarTriggerDelayMillis": "3600000",
        "FIntInterpolationAwareTargetTimeLerpHundredth": "40",
        "FIntInterpolationMaxDelayMSec": "100",
        "FIntLuaGcParallelMinMultiTasks": "16",
        "FIntPreferredTextSizeSettingBetaFeatureRolloutPercent": "100",
        "FIntRenderLocalLightUpdatesMax": "2147483647",
        "FIntRenderLocalLightUpdatesMin": "2147483647",
        "FIntRenderMaxShadowAtlasUsageBeforeDownscale": "2147483647",
        "FIntRomarkStartWithGraphicQualityLevel": "10",
        "FIntRuntimeMaxNumOfConditions": "1000000",
        "FIntRuntimeMaxNumOfDPCs": "64",
        "FIntRuntimeMaxNumOfLatches": "1000000",
        "FIntRuntimeMaxNumOfMutexes": "1000000",
        "FIntRuntimeMaxNumOfSchedulers": "1000000",
        "FIntRuntimeMaxNumOfSemaphores": "1000000",
        "FIntRuntimeMaxNumOfThreads": "1000000",
        "FIntSSAO": "8",
        "FIntSSAOMipLevels": "8",
        "FIntSimSolverResponsiveness": "2147483647",
        "FIntSmoothClusterTaskQueueMaxParallelTasks": "16",
        "FIntSmoothMouseSpringFrequencyTenths": "100",
        "FIntSmoothTerrainPhysicsCacheSize": "2147483647",
        "FIntTaskSchedulerAutoThreadLimit": "16",
        "FIntTaskSchedulerTasksDefaultMaxCountPerCycle": "2147483647",
        "FIntTaskSchedulerTasksDefaultMaxTimeMsPerCycle": "2147483647",
        "FIntUnifiedLightingBlendZone": "2147483647",
        "FIntVertexSmoothingGroupTolerance": "10000",
        "FStringGetPlayerImageDefaultTimeout": "1",
        "FStringTencentAuthPath": "null",
        "FStringVoiceBetaBadgeLearnMoreLink": "null"
      },
      null,
      2
    ),
    category: "graphics",
    difficulty: "safe",
    compatibility: ["Roblox", "Roblox Studio"],
  },
];

export function PresetBrowser({
  isOpen,
  onClose,
  onImport,
}: PresetBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [selectedPreset, setSelectedPreset] = useState<PresetFile | null>(null);
  const [showPresetDetails, setShowPresetDetails] = useState(false);

  // Filter presets based on search term, category, and difficulty
  const filteredPresets = RECOMMENDED_PRESETS.filter((preset) => {
    // Filter by search term
    const matchesSearch =
      preset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by category
    const matchesCategory =
      selectedCategory === "all" || preset.category === selectedCategory;

    // Filter by difficulty
    const matchesDifficulty =
      selectedDifficulty === "all" || preset.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Sort presets
  const sortedPresets = [...filteredPresets].sort((a, b) => {
    switch (sortBy) {
      case "recommended":
        // Custom order for recommended presets
        const order = ["safe", "experimental"];
        return order.indexOf(a.difficulty) - order.indexOf(b.difficulty);
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "difficulty":
        const difficultyOrder = ["safe", "experimental"];
        return (
          difficultyOrder.indexOf(a.difficulty) -
          difficultyOrder.indexOf(b.difficulty)
        );
      default:
        return 0;
    }
  });

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle preset selection
  const handleSelectPreset = (preset: PresetFile) => {
    setSelectedPreset(preset);
    setShowPresetDetails(true);
  };

  // Handle preset import
  const handleImportPreset = () => {
    if (selectedPreset) {
      // Convert PresetFile to CommunityFile format for compatibility
      const communityFile = {
        id: selectedPreset.id,
        title: selectedPreset.title,
        description: selectedPreset.description,
        content: selectedPreset.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        downloads: 0,
        flags: 0,
        status: "approved" as const,
        category: selectedPreset.category,
        difficulty: selectedPreset.difficulty,
        compatibility: selectedPreset.compatibility,
      };

      onImport(communityFile);
      setShowPresetDetails(false);
      setSelectedPreset(null);
    }
  };

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "performance":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
      case "graphics":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800";
      case "ui":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
      case "gameplay":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800";
      case "studio":
        return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800";
      case "mobile":
        return "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800";
      case "desktop":
        return "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "safe":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800";
      case "experimental":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Preset Browser */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-hidden"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-background border rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-background z-10 border-b">
            <div className="flex items-center justify-between p-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Recommended FastFlags Presets
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Curated FastFlag configurations for different use cases and
                  system types
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Search and Filters */}
            <div className="p-4 border-b bg-background">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search presets by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">Recommended</SelectItem>
                      <SelectItem value="alphabetical">Alphabetical</SelectItem>
                      <SelectItem value="difficulty">Levels</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedDifficulty}
                    onValueChange={setSelectedDifficulty}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="safe">Safe</SelectItem>
                      <SelectItem value="experimental">Experimental</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedDifficulty("all");
                      setSearchTerm("");
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Filter by category:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    key="all"
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory("all")}
                  >
                    All Categories
                  </Badge>
                  {AVAILABLE_CATEGORIES.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <Badge
                        key={category.value}
                        variant={
                          selectedCategory === category.value
                            ? "default"
                            : "outline"
                        }
                        className={`cursor-pointer flex items-center gap-1 ${selectedCategory === category.value
                            ? ""
                            : getCategoryColor(category.value)
                          }`}
                        onClick={() => setSelectedCategory(category.value)}
                      >
                        <IconComponent className="h-3 w-3" />
                        {category.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {sortedPresets.length > 0 ? (
                    sortedPresets.map((preset) => {
                      const categoryInfo = AVAILABLE_CATEGORIES.find(
                        (c) => c.value === preset.category
                      );
                      const IconComponent = categoryInfo?.icon || FileText;

                      return (
                        <motion.div
                          key={preset.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card
                            className="h-full cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                            onClick={() => handleSelectPreset(preset)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-md bg-primary/10">
                                  <IconComponent className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-base line-clamp-1">
                                    {preset.title}
                                  </CardTitle>
                                  <CardDescription className="line-clamp-2 mt-1">
                                    {preset.description}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getCategoryColor(
                                    preset.category
                                  )}`}
                                >
                                  {categoryInfo?.label || preset.category}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getDifficultyColor(
                                    preset.difficulty
                                  )}`}
                                >
                                  {preset.difficulty}
                                </Badge>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-start text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Monitor className="h-3.5 w-3.5" />
                                    <span>
                                      {preset.compatibility.length} platforms
                                    </span>
                                  </div>
                                </div>

                                <div className="text-xs text-muted-foreground">
                                  <span className="font-medium">
                                    Compatible:
                                  </span>{" "}
                                  {preset.compatibility.join(", ")}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="col-span-full flex items-center justify-center py-12 text-muted-foreground">
                      <div className="text-center">
                        <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">No presets found</p>
                        <p className="text-sm">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Preset Details Dialog */}
      <Dialog open={showPresetDetails} onOpenChange={setShowPresetDetails}>
        <DialogContent
          className="max-w-4xl max-h-[90vh] overflow-y-auto z-[101]"
          onClick={(e) => e.stopPropagation()}
        >
          {selectedPreset && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  {(() => {
                    const categoryInfo = AVAILABLE_CATEGORIES.find(
                      (c) => c.value === selectedPreset.category
                    );
                    const IconComponent = categoryInfo?.icon || FileText;
                    return (
                      <div className="p-2 rounded-md bg-primary/10">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                    );
                  })()}
                  <div>
                    <DialogTitle className="text-left">
                      {selectedPreset.title}
                    </DialogTitle>
                    <DialogDescription className="text-left mt-1">
                      {selectedPreset.description}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className={getCategoryColor(selectedPreset.category)}
                  >
                    {AVAILABLE_CATEGORIES.find(
                      (c) => c.value === selectedPreset.category
                    )?.label || selectedPreset.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getDifficultyColor(selectedPreset.difficulty)}
                  >
                    {selectedPreset.difficulty}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Difficulty:</span>
                          <span className="ml-2 capitalize">
                            {selectedPreset.difficulty}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Category:</span>
                          <span className="ml-2">
                            {
                              AVAILABLE_CATEGORIES.find(
                                (c) => c.value === selectedPreset.category
                              )?.label
                            }
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>


                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        Compatibility
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedPreset.compatibility.map((platform) => (
                          <div
                            key={platform}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>{platform}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      FastFlag Configuration
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    </div>
                  </div>

                  <Card>
                    <CardContent className="p-4">
                      <pre className="text-xs overflow-auto max-h-64 font-mono bg-muted/30 p-3 rounded-md">
                        {selectedPreset.content}
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleImportPreset}>
                  <Download className="h-4 w-4 mr-2" />
                  Import Preset
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
