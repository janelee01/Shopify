
		jQuery(document).ready(function($){
			var video10 = document.getElementById("video10");
						if ( $(window).width() < LS.desktopBreakpoint) {
		        $('#video10').append('<source src="https://player.vimeo.com/external/241595380.sd.mp4?s=4e8e9efd85128d2837d0fb2a65bddc6023b3a1a4&profile_id=165" type="video/mp4" />');
		    } else {
		        $('#video10').append('<source src="https://player.vimeo.com/external/241595380.hd.mp4?s=6f718acca945b9e68db96f08a2a0e324aec3d73f&profile_id=175" type="video/mp4" />');
		    }
		    		    video10.oncanplay = function() {
		       $('#inline-video-10 .loading').fadeOut();
		       		       if( LS.isElementInViewport(document.getElementById("inline-video-10")) ){
		       	var playPromise = video10.play();
		       	if (playPromise !== undefined) {
		       	  playPromise.then(function() {
		       	    // Automatic playback started, nothing to do
		       	  }).catch(function(error) {
		       	    console.log('Playback did not start. Reason: ' + error)
		       	  });
		       	}
		       }
		    };
						$(window).scroll(function(){
				if( LS.isElementInViewport(document.getElementById("inline-video-10")) ){
					if( !$('#inline-video-10').hasClass('ended') ){
						var playPromise = video10.play();
						if (playPromise !== undefined) {
						  playPromise.then(function() {
						    // Automatic playback started, nothing to do
						  }).catch(function(error) {
						    console.log('Playback did not start. Reason: ' + error)
						  });
						}
					}
				}else{
					var pausePromise = video10.pause();
					if (pausePromise !== undefined) {
					  pausePromise.then(function() {
					    // Paused, nothing to do
					  }).catch(function(error) {
					    console.log('Pause error. Reason: ' + error)
					  });
					}
				}
			});
						var playCount10 = 0;
			var lastTime = 0;
			var $overlayText = $('#video10').closest('.image-panel').not('.half-width-panels').find('.image-panel-content');
			video10.addEventListener("timeupdate", function() {
				if( video10.currentTime > 5 ){
					$overlayText.fadeOut();
				}
				if( playCount10 === 200 ){
					video10.pause();
					$('#inline-video-10').addClass('ended');
					$('.video-trigger10').fadeIn('slow');
				}
								if( video10.currentTime < lastTime ){
					playCount10++;
					lastTime = 0;
				}else{
					lastTime = video10.currentTime;
				}
			}, true);
						$('.video-trigger10').on('click', function(e){
				e.preventDefault();
				$(this).fadeOut('fast');
				$('#inline-video-10').removeClass('ended');
				playCount10 = 0;
			    video10.play();
			});
		});

	
	    	            	    	           	    	
			jQuery(document).ready(function($){
				var video20 = document.getElementById("video20");
							if ( $(window).width() < LS.desktopBreakpoint) {
			        $('#video20').append('<source src="https://player.vimeo.com/external/241596467.sd.mp4?s=3c1cd8f757a70586e150d58fc25b95ab82541433&profile_id=165" type="video/mp4" />');
			    } else {
			        $('#video20').append('<source src="https://player.vimeo.com/external/241596467.hd.mp4?s=2364faa62fb69f19e0b2774fa8f1e2de04a13221&profile_id=175" type="video/mp4" />');
			    }
			    		    video20.oncanplay = function() {
			       $('#inline-video-20 .loading').fadeOut();
			       		       if( LS.isElementInViewport(document.getElementById("inline-video-20")) ){
			       	var playPromise = video20.play();
			       	if (playPromise !== undefined) {
			       	  playPromise.then(function() {
			       	    // Automatic playback started, nothing to do
			       	  }).catch(function(error) {
			       	    console.log('Playback did not start. Reason: ' + error)
			       	  });
			       	}
			       }
			    };
							$(window).scroll(function(){
					if( LS.isElementInViewport(document.getElementById("inline-video-20")) ){
						if( !$('#inline-video-20').hasClass('ended') ){
							var playPromise = video20.play();
							if (playPromise !== undefined) {
							  playPromise.then(function() {
							    // Automatic playback started, nothing to do
							  }).catch(function(error) {
							    console.log('Playback did not start. Reason: ' + error)
							  });
							}
						}
					}else{
						var pausePromise = video20.pause();
						if (pausePromise !== undefined) {
						  pausePromise.then(function() {
						    // Paused, nothing to do
						  }).catch(function(error) {
						    console.log('Pause error. Reason: ' + error)
						  });
						}
					}
				});
							var playCount20 = 0;
				var lastTime = 0;
				var $overlayText = $('#video20').closest('.image-panel').not('.half-width-panels').find('.image-panel-content');
				video20.addEventListener("timeupdate", function() {
					if( video20.currentTime > 5 ){
						$overlayText.fadeOut();
					}
					if( playCount20 === 200 ){
						video20.pause();
						$('#inline-video-20').addClass('ended');
						$('.video-trigger20').fadeIn('slow');
					}
									if( video20.currentTime < lastTime ){
						playCount20++;
						lastTime = 0;
					}else{
						lastTime = video20.currentTime;
					}
				}, true);
							$('.video-trigger20').on('click', function(e){
					e.preventDefault();
					$(this).fadeOut('fast');
					$('#inline-video-20').removeClass('ended');
					playCount20 = 0;
				    video20.play();
				});
			});

		
		    	            	    	           	    	
				jQuery(document).ready(function($){
					var video30 = document.getElementById("video30");
								if ( $(window).width() < LS.desktopBreakpoint) {
				        $('#video30').append('<source src="https://player.vimeo.com/external/241598145.sd.mp4?s=1f430fc63329e444eaa58b221fa92c259913a214&profile_id=164" type="video/mp4" />');
				    } else {
				        $('#video30').append('<source src="https://player.vimeo.com/external/241598145.hd.mp4?s=1b8798273cefcb4e40f9a60c5ff93785c108b191&profile_id=175" type="video/mp4" />');
				    }
				    		    video30.oncanplay = function() {
				       $('#inline-video-30 .loading').fadeOut();
				       		       if( LS.isElementInViewport(document.getElementById("inline-video-30")) ){
				       	var playPromise = video30.play();
				       	if (playPromise !== undefined) {
				       	  playPromise.then(function() {
				       	    // Automatic playback started, nothing to do
				       	  }).catch(function(error) {
				       	    console.log('Playback did not start. Reason: ' + error)
				       	  });
				       	}
				       }
				    };
								$(window).scroll(function(){
						if( LS.isElementInViewport(document.getElementById("inline-video-30")) ){
							if( !$('#inline-video-30').hasClass('ended') ){
								var playPromise = video30.play();
								if (playPromise !== undefined) {
								  playPromise.then(function() {
								    // Automatic playback started, nothing to do
								  }).catch(function(error) {
								    console.log('Playback did not start. Reason: ' + error)
								  });
								}
							}
						}else{
							var pausePromise = video30.pause();
							if (pausePromise !== undefined) {
							  pausePromise.then(function() {
							    // Paused, nothing to do
							  }).catch(function(error) {
							    console.log('Pause error. Reason: ' + error)
							  });
							}
						}
					});
								var playCount30 = 0;
					var lastTime = 0;
					var $overlayText = $('#video30').closest('.image-panel').not('.half-width-panels').find('.image-panel-content');
					video30.addEventListener("timeupdate", function() {
						if( video30.currentTime > 5 ){
							$overlayText.fadeOut();
						}
						if( playCount30 === 200 ){
							video30.pause();
							$('#inline-video-30').addClass('ended');
							$('.video-trigger30').fadeIn('slow');
						}
										if( video30.currentTime < lastTime ){
							playCount30++;
							lastTime = 0;
						}else{
							lastTime = video30.currentTime;
						}
					}, true);
								$('.video-trigger30').on('click', function(e){
						e.preventDefault();
						$(this).fadeOut('fast');
						$('#inline-video-30').removeClass('ended');
						playCount30 = 0;
					    video30.play();
					});
				});

			
			    	            	    	           	    	
					jQuery(document).ready(function($){
						var video40 = document.getElementById("video40");
									if ( $(window).width() < LS.desktopBreakpoint) {
					        $('#video40').append('<source src="https://player.vimeo.com/external/241596234.sd.mp4?s=691552d1ab721c640903c1e8654f401c5cf1a52c&profile_id=164" type="video/mp4" />');
					    } else {
					        $('#video40').append('<source src="https://player.vimeo.com/external/241596234.hd.mp4?s=1226b61023e58353ed0e2dbb971207f960efda90&profile_id=175" type="video/mp4" />');
					    }
					    		    video40.oncanplay = function() {
					       $('#inline-video-40 .loading').fadeOut();
					       		       if( LS.isElementInViewport(document.getElementById("inline-video-40")) ){
					       	var playPromise = video40.play();
					       	if (playPromise !== undefined) {
					       	  playPromise.then(function() {
					       	    // Automatic playback started, nothing to do
					       	  }).catch(function(error) {
					       	    console.log('Playback did not start. Reason: ' + error)
					       	  });
					       	}
					       }
					    };
									$(window).scroll(function(){
							if( LS.isElementInViewport(document.getElementById("inline-video-40")) ){
								if( !$('#inline-video-40').hasClass('ended') ){
									var playPromise = video40.play();
									if (playPromise !== undefined) {
									  playPromise.then(function() {
									    // Automatic playback started, nothing to do
									  }).catch(function(error) {
									    console.log('Playback did not start. Reason: ' + error)
									  });
									}
								}
							}else{
								var pausePromise = video40.pause();
								if (pausePromise !== undefined) {
								  pausePromise.then(function() {
								    // Paused, nothing to do
								  }).catch(function(error) {
								    console.log('Pause error. Reason: ' + error)
								  });
								}
							}
						});
									var playCount40 = 0;
						var lastTime = 0;
						var $overlayText = $('#video40').closest('.image-panel').not('.half-width-panels').find('.image-panel-content');
						video40.addEventListener("timeupdate", function() {
							if( video40.currentTime > 5 ){
								$overlayText.fadeOut();
							}
							if( playCount40 === 200 ){
								video40.pause();
								$('#inline-video-40').addClass('ended');
								$('.video-trigger40').fadeIn('slow');
							}
											if( video40.currentTime < lastTime ){
								playCount40++;
								lastTime = 0;
							}else{
								lastTime = video40.currentTime;
							}
						}, true);
									$('.video-trigger40').on('click', function(e){
							e.preventDefault();
							$(this).fadeOut('fast');
							$('#inline-video-40').removeClass('ended');
							playCount40 = 0;
						    video40.play();
						});
					});

				
				    	            	    	           	    	
						jQuery(document).ready(function($){
							var video50 = document.getElementById("video50");
										if ( $(window).width() < LS.desktopBreakpoint) {
						        $('#video50').append('<source src="https://player.vimeo.com/external/241595642.sd.mp4?s=ea2dfbae0542cfa0a0e5d06c62dbe3ab25ac770c&profile_id=164" type="video/mp4" />');
						    } else {
						        $('#video50').append('<source src="https://player.vimeo.com/external/241595642.hd.mp4?s=37eacb95fab8f968ace4c8b2471afe98de479be1&profile_id=175" type="video/mp4" />');
						    }
						    		    video50.oncanplay = function() {
						       $('#inline-video-50 .loading').fadeOut();
						       		       if( LS.isElementInViewport(document.getElementById("inline-video-50")) ){
						       	var playPromise = video50.play();
						       	if (playPromise !== undefined) {
						       	  playPromise.then(function() {
						       	    // Automatic playback started, nothing to do
						       	  }).catch(function(error) {
						       	    console.log('Playback did not start. Reason: ' + error)
						       	  });
						       	}
						       }
						    };
										$(window).scroll(function(){
								if( LS.isElementInViewport(document.getElementById("inline-video-50")) ){
									if( !$('#inline-video-50').hasClass('ended') ){
										var playPromise = video50.play();
										if (playPromise !== undefined) {
										  playPromise.then(function() {
										    // Automatic playback started, nothing to do
										  }).catch(function(error) {
										    console.log('Playback did not start. Reason: ' + error)
										  });
										}
									}
								}else{
									var pausePromise = video50.pause();
									if (pausePromise !== undefined) {
									  pausePromise.then(function() {
									    // Paused, nothing to do
									  }).catch(function(error) {
									    console.log('Pause error. Reason: ' + error)
									  });
									}
								}
							});
										var playCount50 = 0;
							var lastTime = 0;
							var $overlayText = $('#video50').closest('.image-panel').not('.half-width-panels').find('.image-panel-content');
							video50.addEventListener("timeupdate", function() {
								if( video50.currentTime > 5 ){
									$overlayText.fadeOut();
								}
								if( playCount50 === 200 ){
									video50.pause();
									$('#inline-video-50').addClass('ended');
									$('.video-trigger50').fadeIn('slow');
								}
												if( video50.currentTime < lastTime ){
									playCount50++;
									lastTime = 0;
								}else{
									lastTime = video50.currentTime;
								}
							}, true);
										$('.video-trigger50').on('click', function(e){
								e.preventDefault();
								$(this).fadeOut('fast');
								$('#inline-video-50').removeClass('ended');
								playCount50 = 0;
							    video50.play();
							});
						});

					
					    	            	    	           	    	
							jQuery(document).ready(function($){
								var video60 = document.getElementById("video60");
											if ( $(window).width() < LS.desktopBreakpoint) {
							        $('#video60').append('<source src="https://player.vimeo.com/external/241596642.sd.mp4?s=6477fa2dfeb35697d2e84a8f367e844e4d798d88&profile_id=164" type="video/mp4" />');
							    } else {
							        $('#video60').append('<source src="https://player.vimeo.com/external/241596642.hd.mp4?s=5ab8dda9f74cff0dcab1c1958b42d2542a88d212&profile_id=174" type="video/mp4" />');
							    }
							    		    video60.oncanplay = function() {
							       $('#inline-video-60 .loading').fadeOut();
							       		       if( LS.isElementInViewport(document.getElementById("inline-video-60")) ){
							       	var playPromise = video60.play();
							       	if (playPromise !== undefined) {
							       	  playPromise.then(function() {
							       	    // Automatic playback started, nothing to do
							       	  }).catch(function(error) {
							       	    console.log('Playback did not start. Reason: ' + error)
							       	  });
							       	}
							       }
							    };
											$(window).scroll(function(){
									if( LS.isElementInViewport(document.getElementById("inline-video-60")) ){
										if( !$('#inline-video-60').hasClass('ended') ){
											var playPromise = video60.play();
											if (playPromise !== undefined) {
											  playPromise.then(function() {
											    // Automatic playback started, nothing to do
											  }).catch(function(error) {
											    console.log('Playback did not start. Reason: ' + error)
											  });
											}
										}
									}else{
										var pausePromise = video60.pause();
										if (pausePromise !== undefined) {
										  pausePromise.then(function() {
										    // Paused, nothing to do
										  }).catch(function(error) {
										    console.log('Pause error. Reason: ' + error)
										  });
										}
									}
								});
											var playCount60 = 0;
								var lastTime = 0;
								var $overlayText = $('#video60').closest('.image-panel').not('.half-width-panels').find('.image-panel-content');
								video60.addEventListener("timeupdate", function() {
									if( video60.currentTime > 5 ){
										$overlayText.fadeOut();
									}
									if( playCount60 === 200 ){
										video60.pause();
										$('#inline-video-60').addClass('ended');
										$('.video-trigger60').fadeIn('slow');
									}
													if( video60.currentTime < lastTime ){
										playCount60++;
										lastTime = 0;
									}else{
										lastTime = video60.currentTime;
									}
								}, true);
											$('.video-trigger60').on('click', function(e){
									e.preventDefault();
									$(this).fadeOut('fast');
									$('#inline-video-60').removeClass('ended');
									playCount60 = 0;
								    video60.play();
								});
							});

						
						    	            	    	           	    	
								jQuery(document).ready(function($){
									var video70 = document.getElementById("video70");
												if ( $(window).width() < LS.desktopBreakpoint) {
								        $('#video70').append('<source src="https://player.vimeo.com/external/241595899.hd.mp4?s=e611ef2de47835c3aa4c4de745a6feede7307190&profile_id=175" type="video/mp4" />');
								    } else {
								        $('#video70').append('<source src="https://player.vimeo.com/external/241595899.hd.mp4?s=e611ef2de47835c3aa4c4de745a6feede7307190&profile_id=175" type="video/mp4" />');
								    }
								    		    video70.oncanplay = function() {
								       $('#inline-video-70 .loading').fadeOut();
								       		       if( LS.isElementInViewport(document.getElementById("inline-video-70")) ){
								       	var playPromise = video70.play();
								       	if (playPromise !== undefined) {
								       	  playPromise.then(function() {
								       	    // Automatic playback started, nothing to do
								       	  }).catch(function(error) {
								       	    console.log('Playback did not start. Reason: ' + error)
								       	  });
								       	}
								       }
								    };
												$(window).scroll(function(){
										if( LS.isElementInViewport(document.getElementById("inline-video-70")) ){
											if( !$('#inline-video-70').hasClass('ended') ){
												var playPromise = video70.play();
												if (playPromise !== undefined) {
												  playPromise.then(function() {
												    // Automatic playback started, nothing to do
												  }).catch(function(error) {
												    console.log('Playback did not start. Reason: ' + error)
												  });
												}
											}
										}else{
											var pausePromise = video70.pause();
											if (pausePromise !== undefined) {
											  pausePromise.then(function() {
											    // Paused, nothing to do
											  }).catch(function(error) {
											    console.log('Pause error. Reason: ' + error)
											  });
											}
										}
									});
												var playCount70 = 0;
									var lastTime = 0;
									var $overlayText = $('#video70').closest('.image-panel').not('.half-width-panels').find('.image-panel-content');
									video70.addEventListener("timeupdate", function() {
										if( video70.currentTime > 5 ){
											$overlayText.fadeOut();
										}
										if( playCount70 === 200 ){
											video70.pause();
											$('#inline-video-70').addClass('ended');
											$('.video-trigger70').fadeIn('slow');
										}
														if( video70.currentTime < lastTime ){
											playCount70++;
											lastTime = 0;
										}else{
											lastTime = video70.currentTime;
										}
									}, true);
												$('.video-trigger70').on('click', function(e){
										e.preventDefault();
										$(this).fadeOut('fast');
										$('#inline-video-70').removeClass('ended');
										playCount70 = 0;
									    video70.play();
									});
								});

							
							    	            	    	           	    	
									jQuery(document).ready(function($){
										var video80 = document.getElementById("video80");
													if ( $(window).width() < LS.desktopBreakpoint) {
									        $('#video80').append('<source src="https://player.vimeo.com/external/241598769.sd.mp4?s=7a47e8b8b5ad87270c170b113ffebae596183c68&profile_id=164" type="video/mp4" />');
									    } else {
									        $('#video80').append('<source src="https://player.vimeo.com/external/241598769.hd.mp4?s=578c52078c4bb208379c03c2e327fc0c10015b6f&profile_id=174" type="video/mp4" />');
									    }
									    		    video80.oncanplay = function() {
									       $('#inline-video-80 .loading').fadeOut();
									       		       if( LS.isElementInViewport(document.getElementById("inline-video-80")) ){
									       	var playPromise = video80.play();
									       	if (playPromise !== undefined) {
									       	  playPromise.then(function() {
									       	    // Automatic playback started, nothing to do
									       	  }).catch(function(error) {
									       	    console.log('Playback did not start. Reason: ' + error)
									       	  });
									       	}
									       }
									    };
													$(window).scroll(function(){
											if( LS.isElementInViewport(document.getElementById("inline-video-80")) ){
												if( !$('#inline-video-80').hasClass('ended') ){
													var playPromise = video80.play();
													if (playPromise !== undefined) {
													  playPromise.then(function() {
													    // Automatic playback started, nothing to do
													  }).catch(function(error) {
													    console.log('Playback did not start. Reason: ' + error)
													  });
													}
												}
											}else{
												var pausePromise = video80.pause();
												if (pausePromise !== undefined) {
												  pausePromise.then(function() {
												    // Paused, nothing to do
												  }).catch(function(error) {
												    console.log('Pause error. Reason: ' + error)
												  });
												}
											}
										});
													var playCount80 = 0;
										var lastTime = 0;
										var $overlayText = $('#video80').closest('.image-panel').not('.half-width-panels').find('.image-panel-content');
										video80.addEventListener("timeupdate", function() {
											if( video80.currentTime > 5 ){
												$overlayText.fadeOut();
											}
											if( playCount80 === 100 ){
												video80.pause();
												$('#inline-video-80').addClass('ended');
												$('.video-trigger80').fadeIn('slow');
											}
															if( video80.currentTime < lastTime ){
												playCount80++;
												lastTime = 0;
											}else{
												lastTime = video80.currentTime;
											}
										}, true);
													$('.video-trigger80').on('click', function(e){
											e.preventDefault();
											$(this).fadeOut('fast');
											$('#inline-video-80').removeClass('ended');
											playCount80 = 0;
										    video80.play();
										});
									});

								

										jQuery(document).ready(function($){
											var video90 = document.getElementById("video90");
														if ( $(window).width() < LS.desktopBreakpoint) {
										        $('#video90').append('<source src="https://player.vimeo.com/external/241594704.sd.mp4?s=b20e0da1974958287d306de4f1f7dba07c3aac67&profile_id=164" type="video/mp4" />');
										    } else {
										        $('#video90').append('<source src="https://player.vimeo.com/external/241594704.hd.mp4?s=17de8d8d6bcf9b16955cd8012369120add7c5206&profile_id=175" type="video/mp4" />');
										    }
										    		    video90.oncanplay = function() {
										       $('#inline-video-90 .loading').fadeOut();
										       		       if( LS.isElementInViewport(document.getElementById("inline-video-90")) ){
										       	var playPromise = video90.play();
										       	if (playPromise !== undefined) {
										       	  playPromise.then(function() {
										       	    // Automatic playback started, nothing to do
										       	  }).catch(function(error) {
										       	    console.log('Playback did not start. Reason: ' + error)
										       	  });
										       	}
										       }
										    };
														$(window).scroll(function(){
												if( LS.isElementInViewport(document.getElementById("inline-video-90")) ){
													if( !$('#inline-video-90').hasClass('ended') ){
														var playPromise = video90.play();
														if (playPromise !== undefined) {
														  playPromise.then(function() {
														    // Automatic playback started, nothing to do
														  }).catch(function(error) {
														    console.log('Playback did not start. Reason: ' + error)
														  });
														}
													}
												}else{
													var pausePromise = video90.pause();
													if (pausePromise !== undefined) {
													  pausePromise.then(function() {
													    // Paused, nothing to do
													  }).catch(function(error) {
													    console.log('Pause error. Reason: ' + error)
													  });
													}
												}
											});
														var playCount90 = 0;
											var lastTime = 0;
											var $overlayText = $('#video90').closest('.image-panel').not('.half-width-panels').find('.image-panel-content');
											video90.addEventListener("timeupdate", function() {
												if( video90.currentTime > 5 ){
													$overlayText.fadeOut();
												}
												if( playCount90 === 100 ){
													video90.pause();
													$('#inline-video-90').addClass('ended');
													$('.video-trigger90').fadeIn('slow');
												}
																if( video90.currentTime < lastTime ){
													playCount90++;
													lastTime = 0;
												}else{
													lastTime = video90.currentTime;
												}
											}, true);
														$('.video-trigger90').on('click', function(e){
												e.preventDefault();
												$(this).fadeOut('fast');
												$('#inline-video-90').removeClass('ended');
												playCount90 = 0;
											    video90.play();
											});
										});

									