import { useState } from 'react';
import type { FC } from 'react';
import { 
  CreditCard, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode, 
  Terminal, 
  Layers,
  Sparkles
} from 'lucide-react';

export const PlayBillingUpgradeTab: FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [selectedSdk, setSelectedSdk] = useState<'android_native' | 'flutter'>('android_native');

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const currentPBLVersion = "7.1.1";
  const requiredPBLTarget = "7.0.0+ (Mandatory for Google Play 2026 Policy)";

  const nativeGradlePbl = `// android/app/build.gradle
dependencies {
    // Upgraded Google Play Billing Library (v7.1.1)
    // Replaces deprecated BillingClient v4/v5/v6 APIs
    def billing_version = "${currentPBLVersion}"
    implementation "com.android.billingclient:billing-ktx:$billing_version"
}`;

  const flutterPbl = `# pubspec.yaml
dependencies:
  flutter:
    sdk: flutter
  # Latest in_app_purchase supporting Play Billing Library 7.x
  in_app_purchase: ^3.2.0
  in_app_purchase_android: ^0.3.3`;

  const manifestBilling = `<!-- AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.danielsterling.sterlingsoundaiv2">

    <!-- Required Google Play In-App Billing Permission -->
    <uses-permission android:name="com.android.vending.BILLING" />

    <application
        android:label="Sterling Sound AI v2">
        <!-- Application Components -->
    </application>
</manifest>`;

  const kotlinPbl7Implementation = `// BillingManager.kt (Play Billing Library 7.1.1 Implementation)
package com.danielsterling.sterlingsoundaiv2

import android.app.Activity
import android.content.Context
import com.android.billingclient.api.*
import com.android.billingclient.api.BillingClient.BillingResponseCode
import com.android.billingclient.api.BillingClient.ProductType
import com.android.billingclient.api.QueryProductDetailsParams.Product

class BillingManager(
    private val context: Context,
    private val onPremiumUnlocked: () -> Unit
) : PurchasesUpdatedListener {

    private val billingClient: BillingClient = BillingClient.newBuilder(context)
        .setListener(this)
        .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
        .build()

    fun startConnection() {
        billingClient.startConnection(object : BillingClientStateListener {
            override fun onBillingSetupFinished(billingResult: BillingResult) {
                if (billingResult.responseCode == BillingResponseCode.OK) {
                    // Query products using PBL 7.x queryProductDetailsAsync
                    queryPurchases()
                }
            }

            override fun onBillingServiceDisconnected() {
                // Retry connection logic
            }
        })
    }

    private fun queryPurchases() {
        val productList = listOf(
            Product.newBuilder()
                .setProductId("sterling_sound_pro_mastering")
                .setProductType(ProductType.INAPP)
                .build()
        )

        val params = QueryProductDetailsParams.newBuilder()
            .setProductList(productList)
            .build()

        billingClient.queryProductDetailsAsync(params) { billingResult, productDetailsList ->
            if (billingResult.responseCode == BillingResponseCode.OK) {
                // Store productDetailsList for launchBillingFlow
            }
        }
    }

    fun launchPurchase(activity: Activity, productDetails: ProductDetails) {
        val productDetailsParamsList = listOf(
            BillingFlowParams.ProductDetailsParams.newBuilder()
                .setProductDetails(productDetails)
                .build()
        )

        val billingFlowParams = BillingFlowParams.newBuilder()
            .setProductDetailsParamsList(productDetailsParamsList)
            .build()

        billingClient.launchBillingFlow(activity, billingFlowParams)
    }

    override fun onPurchasesUpdated(billingResult: BillingResult, purchases: List<Purchase>?) {
        if (billingResult.responseCode == BillingResponseCode.OK && purchases != null) {
            for (purchase in purchases) {
                handlePurchase(purchase)
            }
        }
    }

    private fun handlePurchase(purchase: Purchase) {
        if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED) {
            if (!purchase.isAcknowledged) {
                val acknowledgePurchaseParams = AcknowledgePurchaseParams.newBuilder()
                    .setPurchaseToken(purchase.purchaseToken)
                    .build()
                billingClient.acknowledgePurchase(acknowledgePurchaseParams) { ackResult ->
                    if (ackResult.responseCode == BillingResponseCode.OK) {
                        onPremiumUnlocked()
                    }
                }
            } else {
                onPremiumUnlocked()
            }
        }
    }
}`;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900/60 to-cyan-950/50 border border-emerald-500/30 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Google Play Billing Library v7.x Upgrade Suite</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                PBL v{currentPBLVersion} Active
              </span>
            </div>
            <p className="text-sm text-slate-300">
              Upgrading to <strong>Play Billing Library 7.x</strong> ensures full compliance with Google Play’s annual target requirement and replaces legacy <code className="text-slate-400 font-mono">SkuDetails</code> with modern <code className="text-emerald-300 font-mono">ProductDetails</code>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a 
              href="https://developer.android.com/google/play/billing/release-notes" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-semibold text-xs rounded-lg transition-colors"
            >
              PBL Release Notes <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://play.google.com/store/apps/details?id=com.danielsterling.sterlingsoundaiv2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
            >
              App Store Listing <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Compliance & Requirement Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400">Target Google Play Policy</span>
          <p className="text-sm font-semibold text-emerald-400 font-mono flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> {requiredPBLTarget}
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400">Associated App Package</span>
          <p className="text-sm font-semibold text-cyan-300 font-mono truncate">
            com.danielsterling.sterlingsoundaiv2
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-1">
          <span className="text-xs text-slate-400">Key Architectural Change</span>
          <p className="text-sm font-semibold text-purple-300 font-mono">
            ProductDetails &amp; Base Plans
          </p>
        </div>

      </div>

      {/* Upgrade Matrix / Comparison */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          PBL 5/6 &rarr; PBL 7 Key API Migration Checklist
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3 px-2">Feature / Call</th>
                <th className="pb-3">Deprecated (Legacy PBL 4/5)</th>
                <th className="pb-3 text-emerald-400">Modern (PBL 6/7.x)</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              <tr>
                <td className="py-2.5 px-2 font-sans font-medium text-white">Product Model</td>
                <td className="py-2.5 text-rose-400 line-through">SkuDetails / SkuType</td>
                <td className="py-2.5 text-emerald-300">ProductDetails / ProductType</td>
                <td className="py-2.5 text-right"><span className="text-emerald-400 font-sans text-[11px] font-semibold">Updated</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-2 font-sans font-medium text-white">Catalog Query API</td>
                <td className="py-2.5 text-rose-400 line-through">querySkuDetailsAsync()</td>
                <td className="py-2.5 text-emerald-300">queryProductDetailsAsync()</td>
                <td className="py-2.5 text-right"><span className="text-emerald-400 font-sans text-[11px] font-semibold">Updated</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-2 font-sans font-medium text-white">Pending Purchases</td>
                <td className="py-2.5 text-rose-400 line-through">enablePendingPurchases()</td>
                <td className="py-2.5 text-emerald-300">enablePendingPurchases(params)</td>
                <td className="py-2.5 text-right"><span className="text-emerald-400 font-sans text-[11px] font-semibold">Mandatory</span></td>
              </tr>
              <tr>
                <td className="py-2.5 px-2 font-sans font-medium text-white">Purchase Flow Params</td>
                <td className="py-2.5 text-rose-400 line-through">setSkuDetails()</td>
                <td className="py-2.5 text-emerald-300">setProductDetailsParamsList()</td>
                <td className="py-2.5 text-right"><span className="text-emerald-400 font-sans text-[11px] font-semibold">Updated</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Snippets for Dependencies & Manifest */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-white text-sm">Step 1: Update Build Dependencies & Permissions</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedSdk('android_native')}
              className={`px-2.5 py-1 text-xs rounded font-mono transition-colors ${selectedSdk === 'android_native' ? 'bg-cyan-600 text-black font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Native Android (build.gradle)
            </button>
            <button
              onClick={() => setSelectedSdk('flutter')}
              className={`px-2.5 py-1 text-xs rounded font-mono transition-colors ${selectedSdk === 'flutter' ? 'bg-cyan-600 text-black font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              Flutter (pubspec.yaml)
            </button>
          </div>
        </div>

        {/* Dependency snippet */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              {selectedSdk === 'android_native' ? 'android/app/build.gradle' : 'pubspec.yaml'}
            </span>
            <button
              onClick={() => copyToClipboard(selectedSdk === 'android_native' ? nativeGradlePbl : flutterPbl, 'pbl_deps')}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700 font-mono"
            >
              {copiedSection === 'pbl_deps' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              Copy Dependency
            </button>
          </div>
          <pre className="bg-[#05080c] border border-slate-800 rounded-lg p-3 text-xs text-blue-300 font-mono overflow-x-auto">
            {selectedSdk === 'android_native' ? nativeGradlePbl : flutterPbl}
          </pre>
        </div>

        {/* Manifest snippet */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              AndroidManifest.xml Permission Declaration
            </span>
            <button
              onClick={() => copyToClipboard(manifestBilling, 'pbl_manifest')}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700 font-mono"
            >
              {copiedSection === 'pbl_manifest' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              Copy Permission
            </button>
          </div>
          <pre className="bg-[#05080c] border border-slate-800 rounded-lg p-3 text-xs text-purple-300 font-mono overflow-x-auto">
            {manifestBilling}
          </pre>
        </div>
      </div>

      {/* Step 2: Implementation File (Kotlin) */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-semibold text-white text-sm">Step 2: Upgraded Kotlin BillingManager (PBL 7.1.1 Compliant)</h3>
              <p className="text-xs text-slate-400">Handles initialization, asynchronous query, flow launch, and mandatory purchase acknowledgment</p>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(kotlinPbl7Implementation, 'pbl_code')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 text-xs font-semibold rounded border border-emerald-500/40 transition-colors"
          >
            {copiedSection === 'pbl_code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            Copy Kotlin Class
          </button>
        </div>

        <pre className="bg-[#05080c] border border-slate-800 rounded-lg p-4 text-xs text-emerald-300 font-mono overflow-x-auto max-h-96">
          {kotlinPbl7Implementation}
        </pre>
      </div>

      {/* Terminal Verification Step */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-white text-sm">Verify Upgraded Bundle with Gradle Terminal</h3>
          </div>
          <button
            onClick={() => copyToClipboard('./gradlew bundleRelease', 'gradle_build')}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded border border-slate-700 transition-colors"
          >
            {copiedSection === 'gradle_build' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            Copy Command
          </button>
        </div>
        <div className="bg-[#05080c] border border-slate-800 p-3 rounded-lg flex items-center justify-between">
          <code className="text-xs text-cyan-300 font-mono">
            ./gradlew clean bundleRelease
          </code>
          <span className="text-[10px] text-slate-500 font-sans">Builds AAB with PBL 7.1.1</span>
        </div>
      </div>

      {/* Policy Warning Box */}
      <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <h4 className="font-semibold text-amber-300">Mandatory Purchase Acknowledgment within 3 Days</h4>
          <p className="text-slate-400 leading-relaxed">
            Google Play requires all purchases to be acknowledged via <code className="text-amber-300 font-mono">acknowledgePurchase()</code>. If a purchase is not acknowledged within 3 days, Google Play will automatically refund the user and revoke the transaction.
          </p>
        </div>
      </div>

    </div>
  );
};
